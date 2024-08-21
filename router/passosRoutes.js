const express = require('express');
const {passoUm} = require("../controllers/passoUmController")
const {passoDois} = require("../controllers/passoDoisController")
const {passoTres} = require("../controllers/passoTresController")
const {passoQuatro} = require("../controllers/passoQuatroController")
const {passoCinco} = require("../controllers/passoCincoController")
const {passoSeis} = require("../controllers/passoSeisController")
const {passoSete} = require("../controllers/passoSeteController")
const {passoOito} = require("../controllers/passoOitoController")
const {passoNove} = require("../controllers/passoNoveController")
const {passoDez} = require("../controllers/passoDezController")
const {passoOnze} = require("../controllers/passoOnzeController")
const {passoDoze} = require("../controllers/passoDozeController")
const {passoTreze} = require("../controllers/passoTrezeController")
const {passoQuatorze} = require("../controllers/passoQuatorzeController")
const {passoQuinze} = require("../controllers/passoQuinzeController")
const {passoDezesseis} = require("../controllers/passoDezesseisController")
const {passoDezessete} = require("../controllers/passoDezesseteController")
const {passoDezoito} = require("../controllers/passoDezoitoController")
const {passoDezenove} = require("../controllers/passoDezenoveController")
const {passoVinte} = require("../controllers/passoVinteController")
const {passoVinteEUm} = require("../controllers/passoVinteEUmController")
const {passoVinteEDois} = require("../controllers/passoVinteEDoisController")
const {passoVinteETres} = require("../controllers/passoVinteETresController")
const {passoVinteEQuatro} = require("../controllers/passoVinteEQuatroController")

const router = express.Router();

router.post('/um',passoUm );

router.post('/dois',passoDois);

router.post('/tres',passoTres);

router.post('/quatro',passoQuatro);

router.post('/cinco',passoCinco);

router.post('/seis',passoSeis );

router.post('/sete',passoSete);

router.post('/oito',passoOito);

router.post('/nove',passoNove);

router.post('/dez',passoDez);

router.post('/onze',passoOnze);

router.post('/doze',passoDoze);

router.post('/treze',passoTreze);

router.post('/quatorze',passoQuatorze);

router.post('/quinze',passoQuinze);

router.post('/dezesseis',passoDezesseis);

router.post('/dezessete',passoDezessete);

router.post('/dezoito',passoDezoito);

router.post('/dezenove',passoDezenove);

router.post('/vinte',passoVinte);

router.post('/vinteeum',passoVinteEUm);

router.post('/vinteedois',passoVinteEDois);

router.post('/vinteetres',passoVinteETres);

router.post('/vinteequatro',passoVinteEQuatro);

module.exports = router;