const Sauce = require("../models/sauce");
// fonction appel du package pour la gestion des fichiers
const fs = require("fs");
const { json } = require("express");

//----------- Creation d'une Sauce-------//
//fonction pouyr creer une sauce
exports.createSauce = (req, res, next) => {
  //converti en json et je parse
  const sauceObject = json.parse(req.body.sauce);
  //suppression de son Id
  delete sauceObject._id;
  //creation d'un new objet Sauce
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  newSauce
    .save()
    //newSauce retourne un status de réussite
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    //sinon catch d'erreur
    .catch((error) => res.status(400).json({ error }));
};
