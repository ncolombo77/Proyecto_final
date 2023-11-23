import multer from "multer";
import path from 'path';
import bcrypt from "bcrypt";
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";


export const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};


export const isValidPassword = (userDB, password) => {
    return bcrypt.compareSync(password, userDB.password);
};


export const validateToken = (token) => {
    try {
        const info = jwt.verify(token, config.gmail.secretToken);
        return info.email;        
    } catch (error) {
        console.log("Error con el token: ", error.message);
        return null;
    }
}


const checkValidFields = (body) => {
    const {first_name, last_name, email, password} = body;
    if(!first_name || !last_name || !email || !password) {
        return false;
    }
    return true;
}


const multerProfileFilter = (req, file, callback) => {
    const valid = checkValidFields(req.body);
    if (valid) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
}


// Configuración de Multer para almacenar las imágenes de perfil.
const profileStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "/multer/users/img"));
    },
    filename: function(req, file, callback) {
        callback(null, `${req.body.email}-perfil-${file.originalname}`)
    }
});


// Configuración de Multer para almacenar las imágenes de productos.
const productStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "/multer/products/img"));
    },
    filename: function(req, file, callback) {
        callback(null, `${req.body.code}-product-${file.originalname}`)
    }
});



// Configuración de Multer para almacenar los documentos.
const documentsStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "/multer/users/documents"));
    },
    filename: function(req, file, callback) {
        callback(null, `${req.user.email}-document-${file.originalname}`)
    }
});


// Se define el uploader de las imágenes de perfil.
export const uploaderProfile = multer({storage: profileStorage, fileFilter: multerProfileFilter});

// Se define el uploader de las imágenes de los productos.
export const uploaderProduct = multer({storage: productStorage});

// Se define el uploader de los documentos.
export const uploaderDocument = multer({storage: documentsStorage});