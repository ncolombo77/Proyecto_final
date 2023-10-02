export class SessionsController {

    static failedSignup = (req, res) => {
        res.render("signup", { error: "No se pudo registrar el usuario." });
    };


    static failedLogin = (req, res) => {
        res.render("login", {error: "Credenciales incorrectas."})
    };


    static redirectLogin = (req, res) => {
        res.render("login", { message:"Te has registrado exitosamente, para continuar inicia sesión." });
    };


    static redirectProducts = (req, res) => {
        res.redirect(303, "/products");
    };


    static redirectProfile = (req, res) => {
        res.redirect(303, "/profile");
    };


    static logOut = (req, res) => {
        req.logOut(error => {
            if(error) {
                return res.render("profile", {user: req.user, error: "No se pudo cerrar la sesión."});
            }
            else {
                // Elimina la sesión de la base de datos.
                req.session.destroy( error => {
                    if (error) return res.render("profile", {user: req.session.userInfo, error: "No se pudo cerrar la sesión."});
                });
            }
        });
    
        res.redirect(303, "/login");
    };

}