//importation d'express
const express = require("express");
//création d'un router
const router = express.Router();
//router .post
router.post("/", auth, multer, saucesCtrl.createSauce);
//router.get
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.get("/", auth, saucesCtrl.getAllSauce);
//utilisation de router.put + "multer" pour la gestion des modifications images
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likesDislikes);
