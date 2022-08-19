/*------ FICHIER DE ROUTING-----------
------------------------------------*/

//------- REQUIRE----------//

//importation d'express
const express = require("express");
//création d'un router
const router = express.Router();
//importaion du middleware d'authentification
const auth = require("../middleware/auth");
//importation multer
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauces");

//--------création des différentes routes de l'api en leur précisant les middlewares dans l'ordre----//

//route pour récupèrer (obtenir) toutes les Sauces
router.get("/", auth, saucesCtrl.getAllSauce);
//route pour récupèrer (obtenir) un seul objet Sauce
router.get("/:id", auth, saucesCtrl.getOneSauce);
//route pour la creation (publier) de l'objet Sauce
router.post("/", auth, multer, saucesCtrl.createSauce);
//route pour la mofification (mise à jour) de l'objet Sauce
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
//route pour la supression (supprimer) de l'objet Sauce
router.delete("/:id", auth, multer, saucesCtrl.deleteSauce);
//route pour mettre un like ( publier)
router.post("/:id/like", auth, saucesCtrl.likeOrDislikeSauce);
//Exportation du routeur
module.exports = router;
