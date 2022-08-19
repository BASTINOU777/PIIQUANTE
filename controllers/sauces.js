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

/*exports.likeOrDislikeSauce = (req, res) => {
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )

      .then(() => res.status(200).json({ message: "+1 like !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )

      .then(() => res.status(200).json({ message: "+1 dislike !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )

            .then(() => res.status(200).json({ message: "like -1 !" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "Dislike -1 !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};*/

//Gestion des likes et dislikes
exports.likeOrDislikeSauce = (req, res, next) => {
  let like = req.body.like;
  //let likes = req.body.likes;
  //let dislikes = req.body.dislikes;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  let usersLiked = req.body.usersLiked;
  let usersDisliked = req.body.usersDisliked;

  //Liker une sauce
  if (like === 1) {
    //On récupère la sauce par son id
    Sauce.updateOne(
      { _id: sauceId },
      {
        //On ajoute l'id de l'utilisateur dans le tableau de ceux ayant liké la sauce et on incrémente le nombre de likes de 1
        $push: { usersLiked: userId },
        $inc: { likes: req.boby.like++ },
      }
    )
      .then(() => res.status(200).json({ message: "Sauce likée" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //Disliker une sauce
  else if (like === -1) {
    //On récupère la sauce par son id
    Sauce.updateOne(
      { _id: sauceId },
      {
        //On ajoute l'id de l'utilisateur dans le tableau de ceux ayant disliké la sauce et on incrémente le nombre de dislikes de 1
        $push: { usersDisliked: userId },
        $inc: { dislikes: req.boby.like-- },
      }
    )
      .then(() => res.status(200).json({ message: "Sauce dislikée" }))
      .catch((error) => res.status(400).json({ error }), console.log(error));
  }

  //Annulation d'un like ou d'un dislike
  //On récupère la sauce avec son id
  if (like === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        //Annulation du like : si  le user a déjà liké la sauce, on le retire du tableau des users ayant liké la sauce et on décrémente le nombre de likes de 1
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: userId },
              $inc: { likes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({ message: "Le like a été annulé" })
            )
            .catch((error) => res.status(400).json({ error }));
        }

        //Annulation du dislike : si le user a déjà disliké la sauce, on le retire du tableau des users ayant disliké la sauce et on décrémente le nombre de likes de 1
        else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() =>
              res.status(200).json({ message: "Le dislike a été annulé" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })

      .catch((error) => res.status(400).json({ error }));
  }
};
