/*------ FICHIER DE ROUTING-----------
------------------------------------*/

//------- REQUIRE----------//

//importation d'express
const express = require("express");
//importaion du middleware d'authentification
const auth = require("../middleware/auth");
//importation multer
const multer = require("../middleware/multer-config");


const sauceCtrl = require("../controllers/sauces");

//--------création des différentes routes de l'api en leur précisant les middlewares dans l'ordre----//
//création d'un router
const router = express.Router();

//route pour récupèrer (obtenir) toutes les Sauces
router.get("/", auth, sauceCtrl.getAllSauce);
//route pour récupèrer (obtenir) un seul objet Sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);
//route pour la creation (publier) de l'objet Sauce
router.post("/", auth, multer, sauceCtrl.createSauce);
//route pour la mofification (mise à jour) de l'objet Sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//route pour la supression (supprimer) de l'objet Sauce
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
//route pour mettre un like ( publier)
router.post("/:id/like", auth, sauceCtrl.likeorDislikeSauce);
//Exportation du routeur
module.exports = router;
