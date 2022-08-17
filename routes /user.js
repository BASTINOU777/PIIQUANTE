//importation de express pour l'enregistrement et la connexion des utilisateurs
const express = require("express");
//importation du router
const router = express.Router();
//chemin vers User controllers
const userCtrl = require("../controllers/user");

//envoie de l'adresse mail
router.post("/signup", userCtrl.signup);
//envoie du mot de passe
router.post("/login", userCtrl.login);

module.exports = router;
