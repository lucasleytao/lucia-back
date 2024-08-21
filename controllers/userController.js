// controllers/ideaController.js
const supabase = require('../services/supabaseClient');

module.exports = class UserController {
    static async criarUser(req, res) {
        console.log("passou aqui");
        const { email, name, password, confirmPassword, first_name } = req.body;
    
        if (!email) {
            return res.status(422).json({ msg: 'Email é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ msg: 'Senha é obrigatória' });
        }
        if (!confirmPassword) {
            return res.status(422).json({ msg: 'Confirmação de senha é obrigatória' });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ msg: 'As senhas não coincidem' });
        }
    
        try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
    
            if (signUpError) {
                console.error('Erro ao cadastrar usuário:', signUpError);
                return res.status(500).json({ msg: 'Erro ao cadastrar usuário', error: signUpError.message });
            } 
    
            console.log('Cadastro feito:', signUpData);
            const userId = signUpData.user.id;
    
            const { data: progressData, error: progressError } = await supabase.from('progress').insert({});
            
            if (progressError) {
                console.error('Erro ao criar registro na tabela progress:', progressError);
                return res.status(500).json({ msg: 'Erro ao criar registro na tabela progress', error: progressError.message });
            } 
    
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: userId, first_name: first_name }]);
    
            if (profileError) {
                console.error('Erro ao atualizar perfil:', profileError);
                return res.status(500).json({ msg: 'Erro ao atualizar perfil', error: profileError.message });
            }
    
            return res.status(201).json({ msg: 'Usuário cadastrado com sucesso', data: signUpData });
    
        } catch (err) {
            console.error('Erro no bloco try-catch:', err);
            return res.status(500).json({ msg: 'Erro interno do servidor', error: err.message });
        }
    }

    static async Login(req, res) {
        const { email, password } = req.body;
        console.log("email:", email, "senha: ", password);
    
        if (!email) {
            return res.status(422).json({ msg: 'Email é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ msg: 'Senha é obrigatória' });
        }
    
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
    
            if (error) {
                if (error.message === 'Invalid login credentials') {
                    return res.status(401).json({ message: 'Usuário ou senha incorretos' });
                }
                return res.status(502).json({ message: 'Erro ao tentar fazer login', error: error.message });
            }
    
            const { session, user } = data;
    
            
    
        
            const { data: nameUser, error: nameUserError } = await supabase
                .from('profiles')
                .select('first_name')
                .eq('id', user.id)
                .single();
    
            if (nameUserError) {
                return res.status(500).json({ error: nameUserError.message });
            }
    
            console.log(nameUser.first_name);
    
            if (session) {
                return res.status(200).json({
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token,
                    user: user,
                    first_name: nameUser.first_name,
               
                });
            } else {
                return res.status(501).json({ msg: 'Login bem-sucedido, mas sessão não iniciada.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    

     static async getIdeas(req, res) {
        const userId = req.user.sub;
        console.log("user:", userId);
    
        try {
          let { data: ideas, error } = await supabase
            .from('ideas') // Nome da tabela no Supabase
            .select("*")
            .eq('user_id', '889288a8-47d4-4a4d-bfb0-0dd3444d20f6'); 
            
            console.log(ideas)
    
          if (error) {
            return res.status(500).json({ error: error.message });
          }
    
          return res.status(200).json(ideas);
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      }

      static async insertIdeas(req, res) {
        const userId = req.user.sub;
        const { title, description } = req.body;
        console.log("user:", userId);
        
        try {
            let { data: ideas, error } = await supabase
                .from('ideas') 
                .insert([
                    { title, description, user_id: userId } 
                ]);
            
            console.log(ideas); 
        
            if (error) {
                return res.status(500).json({ error: error.message });
            }
        
            return res.status(200).json(ideas);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }


    static async getIdeas(req, res) {
        const userId = req.user.sub;
        console.log("user:", userId);
    
        try {
          let { data: ideas, error } = await supabase
            .from('ideas') // Nome da tabela no Supabase
            .select("*")
            .eq('user_id', userId); 
            
            console.log(ideas)// Certifique-se de que 'user_id' é a coluna correta
    
          if (error) {
            return res.status(500).json({ error: error.message });
          }
    
          return res.status(200).json(ideas);
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      }

    
}
