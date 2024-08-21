const { OpenAI } = require("openai");
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let chatHistoryLocal = [
    {
        role: "system",
        content: "Você é um consultor de ideias. Seu objetivo é ajudar os usuários a desenvolver suas ideias de acordo com seus gostos e afinidades durante sua vida e de acordo com informaçõoes recebidas respostas de até 100 tokens."
    }
]; 



async function getResponse(req, res) {
    const { chatHistory } = req.body;
    
    
    chatHistory.unshift(chatHistoryLocal[0])
    console.log("esse é o array: ", chatHistory);
    try {
       
        let response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatHistory,
            max_tokens: 500,
            temperature:0.7
        });

        

          
console.log("essa é a resposta",response.choices[0])
        res.status(200).json({ response });
    } catch (error) {
        console.error('Erro ao consultar o ChatGPT:', error);
        res.status(500).send('Erro no servidor');
    }
}

module.exports = { getResponse };
