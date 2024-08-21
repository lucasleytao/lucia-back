const jwt = require('jsonwebtoken');

// funcao middleware 'intermediaria' de verificacao de token
const verifyToken = (req, res, next) => {
    // obtem o cabecalho de autorizacao da requisicao
    const authHeader = req.headers.authorization;

    // verifica se o cabecalho de autorizacao esta presente
    if (authHeader) {
        // extrai o token do cabeçalho de autorizacao
        const token = authHeader.split(' ')[1];

        // verifica a validade do token usando a chave secreta
        jwt.verify(token, process.env.SUPABASE_JWT_SECRET, (err, user) => {
            // tratamento de erros
            if (err) {
                
                console.error(err);
                
                return res.status(403).json({ msg: "Token inválido" });
            }

            // atribui o objeto do usuario extraido do token a requisicao
            req.user = user;
            // chama a proxima funcao middleware na cadeia
            next();
        });
    } else {
        // Caso o cabecalho de autorizacao nao esteja presente
        // Retorna uma resposta com status 403 (Forbidden) e uma mensagem de acesso nao autorizado
        return res.status(403).json({ msg: "Você não é autorizado a acessar esse end-point" });;
    }
};

// exporta o middleware de verificacao de token
module.exports = {
    verifyToken
};
