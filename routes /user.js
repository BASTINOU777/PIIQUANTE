//importation de express pour l'enregistrement et la connexion des utilisateurs
const express = require("express");
//importation du router
const router = express.Router();
//chemin vers User controllers
const userCtrl = require("../controllers/user");
//importation des middleware
const auth = require("../middleware/auth");

//Middleware de validation des email , pour faire la verification de l'email  pour se connecter

const emailValid = require("../middleware/emailValid");
const passValid = require("../middleware/passwordValid");
//envoie de l'adresse mail
router.post("/signup", passValid, emailValid, userCtrl.signup);
//envoie du mot de passe
router.post("/login", userCtrl.login);

module.exports = router;
