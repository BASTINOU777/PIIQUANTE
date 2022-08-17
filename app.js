//Installation de express
const express = require("express");
//const bodyParser = require("body-parser");
//Installation de Moogose est le module pour utiliser MongoDB
const mongoose = require("mongoose");
//Installation du Module qui gère les routes
const path = require("path");

//------Importation de routes pour enregistrer les routes app.use vers le front-------//
const sauceRoutes = require("./routes /sauces");
//import sauceRouter from "./routes/stuff";
const userRoutes = require("./routes /user");
const app = express();

//-----------MONGOOSE------------------//

// mongodb+srv://jimbob:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority
mongoose
  .connect(
    "mongodb+srv://BASTINOU777:QDiFGvwyVUtF8lgc@cluster0.3yivc.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée !", error));
  //------------------ROUTES--------------------//

//route générale pour transformer mes requétes en json 
app.use(express.json());

//CORS 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Conversion en JSON
//app.use(bodyParser.json());

//route pour accéder aux images du dossier image
app.use("/images", express.static(path.join(__dirname, "images")));
//route générale pour les sauces
app.use("/api/sauces", sauceRoutes);
//route générale pour l'authentification des utilisateurs 
app.use("/api/auth/", userRoutes);

module.exports = app;
