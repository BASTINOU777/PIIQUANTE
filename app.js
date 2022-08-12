//Installation de express
const express = require("express");
//Installation de Moogose est le module pour utiliser MongoDB
const mongoose = require("mongoose");
//Installation du Module de Securité pour protéger les headers
const helmet = require("helmet");
//Installation du Module de Sécurité contre les attaques XSS
const xss = require("xss-clean");
//Installation du Module Express pour mettre un temps de session limité
const rateLimit = require("express-rate-limit");
//Installation du Module pour charger mes variables
const dotenv = require("dotenv");
//Installation de Cors
const cors = require("cors");
//Installation du Module de Protection  contre les attaques à injection noSql
const mongoSanitize = require("express-mongo-sanitize");
//Installation du Module qui aide a cacher les adresses MongoDB
const path = require("path");

//------Importation de routes pour enregistrer les routes app.use vers le front-------//
const sauceroutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const app = express();

//-----------MONGOOSE------------------//
mongoose
  .connect(HIDDEN_TOKEN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//------------- HEADERS CORS------------//
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
app.use(bodyParser.json());

//Gestion des images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth/", userRoutes);

module.exports = app;
