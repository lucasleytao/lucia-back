// controllers/ideaController.js
const supabase = require('../services/supabaseClient');

class CheckStepController {
  static async checkStep(req, res) {
   try {
    const {id} = req.params
    const {data,error} = await supabase.from("progress").select("step")
    .eq('id_idea', id);
    console.log()
    return res.json({data})
    
   } catch (error) {
    return res.status(500).json({ error: error.message });
   }
  }
  }

  


module.exports = CheckStepController;
