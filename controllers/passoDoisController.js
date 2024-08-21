const { OpenAI } = require("openai");
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const supabase = require("../services/supabaseClient");

async function passoDois(req, res) {
    const assistantId = "asst_avYP4SJmREIyZKriMrf3ORic";
    console.time("mymethod");
    const { title, description, idIdea, passoAtual, forceOpenAI } = req.body;
    const userId = req.user.sub;

    console.log(req.body);
    try {
        if (!forceOpenAI) {
            const { data: response_bot, error: error_bot } = await supabase
                .from('response_bot')
                .select('response')
                .eq('id_idea', idIdea)
                .eq('id_user', userId)
                .eq('step', passoAtual);

            if (response_bot && response_bot.length > 0) {
                console.log("Stored response found:", response_bot[0].response);
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

        console.log("Response table:", messages);

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

                    console.log("Assistant response:", text.value);
                    console.log("Citations:", citations.join("\n"));

                    // Store the response in the database
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
                        console.error('Error storing the response in the database:', error);
                    } else {
                        console.log('Response successfully stored:', data);
                    }

                    res.status(200).json({ response: text.value });
                }
            });

    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        res.status(500).send('Server error');
    }
    console.timeEnd("mymethod");
}

module.exports = { passoDois };
