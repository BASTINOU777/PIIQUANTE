/*------ FICHIER DE RECUPERATION -----------
---------DE LA LOGIQUE METIER -------------*/

const Sauce = require("../models/sauces");
// fonction appel du package pour la gestion des fichiers
const fs = require("fs");
const { json } = require("express");

//-------------LES 4 ETATS DU CRUD---------------//

//-----Creation de l'objet d'une Sauce
exports.createSauce = (req, res, next) => {
  //converti en json et je parse
  console.log("sauce:", req.body);
  const sauceObject = { ...req.body };
  //console.log (req.file);
  //console.log(sauceObject);
  //suppression de son Id
  delete sauceObject._id;
  //creation d'un new objet Sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // console.log(sauce);
  sauce
    .save()
    //newSauce retourne un status de réussite
    .then(() => res.status(201).send({ message: "Sauce enregistrée !" }))
    //sinon catch d'erreur
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
//-----Récupération de l'objet : toutes les Sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
//-------- Récupération de l'objet : une Sauce
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

//--------- Modification de l'objet: une Sauce
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
//----------- Supprimer de l'objet : une Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((Sauce) => {
      const filename = Sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//--------------Gestion des Dislikes et Likes ------------------//
exports.likeorDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  //------- Like d'une sauce

  //Si on like une sauce la valeur de "1" est ici pour indiquer un "like"
  if (like === 1) {
    //on récupère la sauce grace à son id
    Sauce.updateOne({ _id: sauceId }),
      {
        //utilisation $push de MongoDB pour ajouter l'id de l'utilisateur dans le tableau de ceux ayant liké la sauce
        $push: { usersLiked: userId },
        //utilisation $inc de MongoDB pour incrémenter de 1 les likes
        $inc: { likes: +1 },
      }
        //reponse 200 envoyée
        .then(() => res.status(200).json({ message: "J'aime la sauce !" }))
        //sinon erreur 400
        .catch((error) => res.status(400).json({ error }));
  }

  //------Dislike

  //si like à une valeur négative de -1 cela signifie 1 dislike
  if (like === -1) {
    //on récupère la sauce grace à son id
    Sauce.updateOne({ _id: sauceId }),
      {
        //utilisation $push de MongoDB pour ajouter l'id de l'utilisateur dans le tableau de ceux ayant disliké la sauce
        $push: { usersDisLiked: userId },
        //utilisation $inc de MongoDB pour incrémenter de 1 les dislikes
        $inc: { dislikes: +1 },
      }
        //reponse 200 envoyée
        .then(() => res.status(200).json({ message: "J'aime plus la sauce !" }))
        //sinon erreur 400
        .catch((error) => res.status(400).json({ error }));
  }

  //----- Annulation d'un like ou d'un dislike-----------//

  //----annulation d'un like
  //si like à une valeur de 0 cela qui
  if (like === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        console.log(sauce);
        //si l'utilisateur à déja like la sauce
        if (sauce.usersLiked.includes(userId)) {
          //on récupère la sauce grace à son id
          Sauce.updateOne(
            { _id: sauceId },
            {
              //utilisation $push de MongoDB pour retirer l'id de l'utilisateur dans le tableau de ceux ayant liké la sauce
              $push: { usersLiked: userId },
              //utilisation $inc de MongoDB pour incrémenter de -1 les likes
              $inc: { likes: -1 },
            }
          )

            //reponse 200 envoyée
            .then(() => res.status(200).json({ message: "like annulé !" }))
            //sinon erreur 400
            .catch((error) => res.status(400).json({ error }));
        }
        //----annulation d'un dislike
        if (sauce.usersLiked.includes(userId)) {
          //on récupère la sauce grace à son id
          Sauce.updateOne(
            { _id: sauceId },
            {
              //utilisation $push de MongoDB pour retirer l'id de l'utilisateur dans le tableau de ceux ayant disliké la sauce
              $pull: { usersDisLiked: userId },
              //utilisation $inc de MongoDB pour incrémenter de -1 les likes
              $inc: { dislikes: -1 },
            }
          )
            //reponse 200 envoyée
            .then(() => res.status(200).json({ message: "dislike annulé !" }))
            //sinon erreur 400
            .catch((error) => res.status(400).json({ error }));
        }
      })
      //si rien ne fonctionne alors erreur 400
      .catch((error) => res.status(400).json({ error }));
  }
};
