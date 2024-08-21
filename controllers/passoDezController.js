const { OpenAI } = require("openai");
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const supabase = require("../services/supabaseClient");


async function passoDez(req, res) {
    const assistantId = "asst_4ztvAlvrU424bwIUH9Eoh4th";

    console.time("mymethod");
    const { title, description, idIdea, passoAtual, forceOpenAI } = req.body;
    const userId = req.user.sub;

    

    console.log(req.body);
    try {
        if (!forceOpenAI) {
            let { data: response_bot, error } = await supabase
                .from('response_bot')
                .select('response')
                .eq('id_idea', idIdea)
                .eq("id_user", userId)
                .eq("step", passoAtual);

            if (response_bot && response_bot.length > 0) {
                console.log("Resposta armazenada encontrada:", response_bot[0].response);
                res.status(200).json({ response: response_bot[0].response });
                console.timeEnd("mymethod");
                return;
            }
        }
        const { data: response_table, error: error_table } = await supabase
        .from('response_table')
        .select('response')
        .eq('id_idea', idIdea)
        .eq('id_user', userId);

    const messages = response_table.map((item, index) => ({
        role: "user",
        content: `Informação ${index + 1}:${item.response} title: ${title} description: ${description}`

    }));

    console.log("Response table:", response_table);
        const thread = await openai.beta.threads.create({
            messages
        });

        const stream = openai.beta.threads.runs
            .stream(thread.id, {
                assistant_id: assistantId
            })
            .on("textCreated", () => console.log("assistant >"))
            .on("toolCallCreated", (event) => console.log("assistant " + event.type))
            .on("messageDone", async (event) => {
                if (event.content[0].type === "text") {
                    const { text } = event.content[0];
                    const { annotations } = text;
                    const citations = [];

                    let index = 0;
                    for (let annotation of annotations) {
                        text.value = text.value.replace(annotation.text, "[" + index + "]");
                        const { file_citation } = annotation;
                        if (file_citation) {
                            const citedFile = await openai.files.retrieve(file_citation.file_id);
                            citations.push("[" + index + "]" + citedFile.filename);
                        }
                        index++;
                    }

                    console.log("Resposta do assistente: ", text.value);
                    console.log("Citações: ", citations.join("\n"));

                    // Armazena a resposta no banco de dados
                    const { data, error } = await supabase
                        .from('response_bot')
                        .insert([
                            {
                                id_idea: idIdea,
                                id_user: userId,
                                response: text.value,
                                step: passoAtual
                                
                            }
                        ]);

                    if (error) {
                        console.error('Erro ao armazenar a resposta no banco de dados:', error);
                    } else {
                        console.log('Resposta armazenada com sucesso:', data);
                    }

                    res.status(200).json({ response: text.value });
                }
            });
    } catch (error) {
        console.error('Erro ao consultar o ChatGPT:', error);
        res.status(500).send('Erro no servidor');
    }
    console.timeEnd("mymethod");
}

module.exports = { passoDez };