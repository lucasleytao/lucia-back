// controllers/ideaController.js
const supabase = require('../services/supabaseClient');

class IdeaController {
  static async insertIdeas(req, res) {
    const userId = req.user.sub;
    const { title, description } = req.body;
  
    try {
      
      const { data: ideas, error: insertIdeaError } = await supabase
        .from('ideas')
        .insert([{ title, description, user_id: userId }])
        .select();
  
      if (insertIdeaError) {
        return res.status(500).json({ error: insertIdeaError.message });
      }
  
      const newIdeaId = ideas[0].id;
      console.log("Última ideia inserida", newIdeaId);
  
   
      const { data: newProgress, error: newProgressError } = await supabase
        .from('progress')
        .insert({ user_id: userId, id_idea: newIdeaId })
        .single();
  
      if (newProgressError) {
        return res.status(500).json({ error: newProgressError.message });
      }
  
     
      return res.status(200).json({ idea: ideas[0], progress: newProgress });
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getIdeas(req, res) {
    const userId = req.user.sub;
    console.log("user:", userId);

    try {
      let { data: ideas, error } = await supabase
        .from('ideas')
        .select("*")
        .eq('user_id', userId);

      console.log(ideas);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(ideas);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteIdea(req, res) {
    const idIdea = req.body.idIdea;
    console.log("idIdea:", idIdea);

    try {
      let { data: ideas, error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idIdea);

      console.log(ideas);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(ideas);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async editIdea(req, res) {
    const userId = req.user.sub;
    const { id_idea, title, description } = req.body;
    
    try {
      let { data: ideas, error } = await supabase
        .from('ideas')
        .update({ title, description, user_id: userId })
        .eq('id', id_idea);

      console.log(ideas);

      if (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(ideas);
    } catch (err) {
      console.log(error.message)
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = IdeaController;
