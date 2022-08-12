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

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.put("/:id", auth, multer, checkSauceInput, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
