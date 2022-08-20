//Importation mongoose avec
const mongoose = require("mongoose");
//pluging de moogose validator
const uniqueValidator = require("mongoose-unique-validator");

//Création du schema de validation
//permet de n'avoir qu'un seul mail par collection
const userSchema = mongoose.Schema({
  //adresse mail de l'utilisateur avec H de type string et unique
  email: { type: String, required: true, unique: true },
  //mot de passe de l'utilisateur
  password: { type: String, required: true },
});

//application du pluging uniqueVaidator au shéma
userSchema.plugin(uniqueValidator);
//Exportation du shéma sous forme de model en utilisant la fonction "model"
module.exports = mongoose.model("user", userSchema);
