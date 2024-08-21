const supabase = require('../services/supabaseClient');

class responseController {
  static async insertResponse(req, res) {
    const { response, step, ideaId } = req.body;
    const userId = req.user.sub;

    try {
      let { data: existingResponse, error: errorExisting } = await supabase
        .from('response_table')
        .select('*')
        .eq('id_user', userId)
        .eq('id_idea', ideaId)
        .eq('step', step);
      
      if (errorExisting) {
        console.log("foi aqui")
        throw errorExisting;
      }

      console.log("existing", existingResponse);

      // Verificação adicional para quando existingResponse é null
      if (!existingResponse || existingResponse.length === 0) {
        let { data, error } = await supabase
          .from('response_table')
          .upsert([
            { response: response, step: step, id_user: userId, id_idea: ideaId }
          ], { onConflict: ['id_user', 'id_idea', 'step'] });

        if (error) {
          throw error;
        }

        // Chamar a função RPC 'update_step'
        let { data: dataProgress, error: errorProgress } = await supabase
          .from('progress')
          .update({ step: step })
          .eq('id_idea', ideaId)
          .eq('user_id', userId)
          .select();

        if (errorProgress) {
          throw errorProgress;
        }

        console.log("data:", data);
        console.log("data progress:", dataProgress);

        
        return res.status(200).json({ data, dataProgress });
      } else {
        console.log("resposta desse passo já foi enviada");
        return res.json({ message: "resposta desse passo já foi enviada", resposta: existingResponse[0] });
      }
    } catch (err) {
      console.log("err:", err);
      return res.status(500).json({ error: err.message });
    }
  }


  static async getResponses(req,res){
    const { ideaId } = req.body;
    const userId = req.user.sub;

  try {
    let { data, error} = await supabase
    .from('response_table')
    .select('*')
    .eq('id_user', userId)
    .eq('id_idea', ideaId);
  
  if (error) {
    console.log("foi aqui")
    throw error;
  }

  res.json({respostas:data})

  console.log("existing", data);
  } catch (error) {
    console.log(error)

    res.json({message:error.message})
  }
  }


  static async updateResponse(req,res){
    const { changedResponses } = req.body;

    try {
      

      for(let item of changedResponses ){
        if(item){
          const { data, error } = await supabase.from('response_table')
          .update({ response: item.response })
          .eq('id', item.id)
          .select()

          console.log("data: ",data)
        }
      }
        
    } catch (error) {
      res.json({message:error.message})
    }
     
  }
}

module.exports = responseController;
