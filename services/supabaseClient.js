// carrega as variaveis de ambiente do arquivo .env para o process.env
require('dotenv').config();

// importa a funcao createClient do pacote @supabase/supabase-js
const { createClient } = require('@supabase/supabase-js');

// URL do projeto supabase (o "endereço" da instancia do banco de dados)
const supabaseUrl = 'https://vrgbfzsvbphpxycqmzmj.supabase.co';

// chave secreta de API do Supabase obtida das variaveis de ambiente
const supabaseKey = process.env.SUPABASE_KEY;

// cria um cliente do Supabase que permite interagir com o banco de dados
const supabase = createClient(supabaseUrl, supabaseKey);

// exporta o cliente supabase para ser utilizado em outros arquivos
module.exports = supabase;
