//importation package jsonwebtoken pour lire les tokens
const jwt = require("jsonwebtoken");

//-------Module d'authentification---------------------//

//Cette Fonction, fait que seul le bon utililsateur puisse changer sa sauce
module.exports = (req, res, next) => {
  try {
    //récupération du token en enlevant le mot clef et récupération du token après
    const token = req.headers.authorization.split(" ")[1];
    //vérification et décodage du token avec la clé secrète
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //récupération du userId
    const userId = decodedToken.userId;

    // Si l'ID utilisateur ne correspond pas au TOKEN , un message est envoyé pour indiquer "ID utilisateur invalide"**
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user Id";
    } else {
      //Sinon le prochain Middleware est appelé
      next();
    }
  } catch {
    // si problème alors erreur 401 (donnés) avec message d'erreur
    res.status(401).json({ error: new Error("Invalid Request!") });
  }
};
