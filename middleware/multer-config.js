//importation du package multer
const multer = require("multer");
//appel de MINE TYPE pour les images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//fonction "diskStorage" pour enregistrer sur le disque
const storage = multer.diskStorage({
  //fonction "destination"qui prend 3 arguments (requète, file et un callback)
  destination: (req, file, callback) => {
    //appel du callback avec le dossier "images"
    callback(null, "images");
  },
  //fonction "filename" qui prends 3 arguments
  filename: (req, file, callback) => {
    console.log(file);
    // fonction d'origine du nom avec la méthode split et appellant .join
    const name = file.originalname.split(" ").join("_");
    //utilisation de MINE TYPES
    const extension = MIME_TYPES[file.mimetype];
    //appel du calback en ajoutant un date now
    callback(null, name + Date.now() + "." + extension);
  },
});
//appel de la méthode multer et on lui passe storage
module.exports = multer({ storage: storage }).single("image"); 
