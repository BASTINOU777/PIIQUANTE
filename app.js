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
dotenv.config();
const { HIDDEN_TOKEN } = require("./config.json");
//Description des erreurs dans le terminal
const morgan = require("morgan");

//------Importation de routes pour enregistrer les routes app.use vers le front-------//
const sauceroutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const app = express();

//-----------MONGOOSE------------------//
mongoose
  .connect(HIDDEN_TOKEN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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

//Utilisation de Express body parser au lieu de Body Parser
app.use(express.json());

app.use(helmet());

app.use(xss());

app.use(mongoSanitize());

app.use(cors());

app.use(morgan("dev"));

const limiter = rateLimit({
  //Une session n'est valide que pendant 15 minutes
  windowMs: 15 * 60 * 1000,
  //limitation à 100 requêtes par IP
  max: 100,
});
//-------- Importaion des app.use ------------//
app.use(limiter);

app.use("/images", express.static(path.join(__dirname, "images")));
//importation des routes vers "saucesRoutes"
app.use("/api/sauces", saucesRoutes);
//importation des routes user
app.use("/api/auth", userRoutes);

module.exports = app;
