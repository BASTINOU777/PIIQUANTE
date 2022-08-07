//Importation mongoose avec mongoDB
const mongoose = require("mongoose");

//Le schéma des sauces
const schemaSauce = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

module.exports = mongoose.model("sauce", schemaSauce);
