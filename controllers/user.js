//importation du package bcrypt pour hash (crypter) des mots de passe
const bcrypt = require("bcrypt");
//Authentification avec un TOKEN utilisateur unique
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Fonction Middleware "export" pour l'enregistrement utilisateur
//signup créé le mot de passe crypté
module.exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    //creation nouvel utilisateur
    .then((hash) => {
      const user = new User({
        //ajout de l'adresse mail dans le coprs de la requète
        email: req.body.email,
        //ajout du mot de passe crypté au new user
        password: hash,
      });
      //enregistrement du nouvel utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    //capter l'erreur 500 dans un objet
    .catch((error) => res.status(500).json({ error }));
};

// Fonction Midleware "login" pour la connexion des utilisateurs existants
module.exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(501).json({ error }));
};
