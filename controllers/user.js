//importation du package bcrypt pour hash (crypter) des mots de passe
const bcrypt = require("bcrypt");
//Importation du pakage jsonwebtoken pour de creer mon token et de le vérifier
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
        password: hash
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
  //méthode findOne qui permet de vérifier si l'user existe et que c'est bien son mot de passe
  User.findOne({ email: req.body.email })
    //vérification que l'utilisateur à était trouvé
    .then((user) => {
      //si utilisateur est null
      if (!user) {
        //retourne une erreur avec un message flou
        return res
          .status(401)
          .json({ error: "Paire login/mot de pass incorecte !" });
      }
      //fonction bcrypt
      bcrypt
        //méthode "compae" de bcrypt pour comparer le mtp
        .compare(req.body.password, user.password)
        .then((valid) => {
          //si mot de passe correct
          if (!valid) {
            //sinon retourne une erreur 401 avec message flou
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //si le mot de pass correct retourne code 200 avec un ojbjet avec token et user id
          res.status(200).json({
            userId: user._id,
            //appel de la fonction "sign" avec les arguments userid et la clefs secrète pour l'encodage
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              //et application d'expiration de 24h
              expiresIn: "24h",
            }),
          });
        })
        //sinon erreur server (500)
        .catch((error) => res.status(500).json({ error }));
    })
    //sinon erreur de donnés 500
    .catch((error) => res.status(500).json({ error }));
};
