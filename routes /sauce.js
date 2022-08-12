/*------ FICHIER DE ROUTING-----------
------------------------------------*/

//------- REQUIRE----------//

//importation d'express
const express = require("express");
//importaion du middleware "auth"

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const checkSauceInput = require("../middleware/check-sauce-input");
//creation de
const sauceCtrl = require("../controllers/sauce");
//--------création des différentes routes de l'api en leur précisant les middlewares dans l'ordre----//
//création d'un router
const router = express.Router();
//route qui récupère tous les objets Sauces
router.get("/", auth, sauceCtrl.getAllSauces);
//route qui récupère un seul objet Sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);
//route qui récupère la creation de l'objet Sauce
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.put("/:id", auth, multer, checkSauceInput, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
