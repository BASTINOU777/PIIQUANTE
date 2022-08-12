/*------ FICHIER DE RECUPERATION -----------
---------DE LA LOGIQUE METIER -------------*/

const Sauce = require("../models/sauce");
// fonction appel du package pour la gestion des fichiers
const fs = require("fs");
const { json } = require("express");

//----------- Creation de l'objet d'une Sauce-------//
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

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
//----------- Récupération de l'objet : une Sauce-------//
exports.getOneSauce = (req, res, rest) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
//--------- Modification de l'objet: une Sauce----------//
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};
