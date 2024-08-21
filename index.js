const express = require('express');
const cors = require("cors");
const supabase = require('./services/supabaseClient');
const { getResponse } = require("./controllers/apiController");
const passoUmController = require("./controllers/passoUmController");
const UserController = require("./controllers/userController");
const IdeaController = require("./controllers/ideaController");
const stepRoutes = require('./router/passosRoutes');
const { verifyToken } = require("./middlewares/userAuth");
const CheckStepController = require("./controllers/checkStep")
const ResponseController = require('./controllers/responseController');
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/passo', verifyToken,stepRoutes);
app.post("/criarIdeia", verifyToken, IdeaController.insertIdeas); 
app.post("/getResponse", verifyToken, getResponse);
app.post("/register", UserController.criarUser);
app.post("/login", UserController.Login);
app.get("/ideas", verifyToken, IdeaController.getIdeas);
app.post("/ideas", verifyToken, IdeaController.insertIdeas);
app.delete("/ideas", verifyToken, IdeaController.deleteIdea);
app.put("/ideas", verifyToken, IdeaController.editIdea);
app.post("/checkstep/:id", CheckStepController.checkStep);
app.post("/userresponse",verifyToken,ResponseController.insertResponse)
app.post("/getOldResponses",verifyToken,ResponseController.getResponses)
app.put("/updateResponse",verifyToken,ResponseController.updateResponse);

app.get("/", async (req, res) => {
    res.send("LucIA created by Inov@ Biz");
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});
