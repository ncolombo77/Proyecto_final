import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { gmailTransporter } from "../config/gmail.config.js";


export const generateEmailWithToken = (email, expireTime) => {

    const token =  jwt.sign({email}, config.gmail.secretToken, {expiresIn: expireTime});

    return token;

};


export const recoveryEmail = async (req, userEmail, emailToken) => {
    try {

        const domain = `${req.protocol}://${req.get('host')}`;

        const link = `${domain}/reset-password?token=${emailToken}`;

        await gmailTransporter.sendMail({
            subject: "Reestablecimiento de contraseña",
            to: userEmail,
            from: "Ecommerce Coderhouse",
            html: `
                <p>Se recibió una solicitud de reestablecimiento de contraseña</p>
                <p>Haga clic en <a href="${link}">este link</a> para reestablecerla.</p>
            `
        });

    } catch (error) {

        console.log(`Se produjo un error ${error.message}`)

    }
};


export const deletedProductEmail = async (userEmail, product) => {
    try {

        await gmailTransporter.sendMail({
            subject: "Producto eliminado",
            to: userEmail,
            from: "Ecommerce Coderhouse",
            html: `
                <p>Se eliminó un producto que usted había creado:</p>
                <p>Id del producto: ${product._id}</p>
                <p>Nombre: ${product.title}</p>
                <p>Descripción: ${product.description}</p>
            `
        });

    } catch (error) {

        console.log(`Se produjo un error ${error.message}`)

    }
};