import { UsersServices } from "../services/users.services.js";

export class UsersController {

    static modifyRole = async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await UsersServices.getUserById(userId);
            const userRole = user.role;

            // Se valida el estado del usuario.
            if (user.documents.length >= 3 && user.status === "completo") {

                // Cambia el rol del usuario entre "Premium" y "User".
                if (userRole === "user") {
                    user.role = "premium";
                } else if (userRole === "premium") {
                    user.role = "user";
                } else {
                    return res.json({status: "error", message: "No se puede cambiar el rol de ese usuario."});
                };
                await UsersServices.updateUser(user._id, user);
                return res.json({status: "success", message: `El nuevo rol del usuario es ${user.role}`});

            }
            else {
                res.json({status: "error", message: "El usuario no ha cargado todos los documentos."});

            }

        }
        catch (error) {
            res.json({status: "error", message: error.message});
        }
    };


    static uploadDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;

            const user = await UsersServices.getUserById(userId);

            const identificacion = req.files?.identificacion[0] || null;
            const domicilio = req.files?.domicilio[0] || null;
            const estadoDeCuenta = req.files?.estadoDeCuenta[0] || null;

            const docs = [];

            if(identificacion) {
                docs.push({ name: "identificacion", reference: identificacion.filename });
            }

            if(domicilio) {
                docs.push({ name: "domicilio", reference: domicilio.filename });
            }

            if(estadoDeCuenta) {
                docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename });
            }

            user.documents = docs;

            if(docs.length === 3) {
                user.status = "completo";
            }
            else {
                user.status = "incompleto";
            }

            const result = await UsersServices.updateUser(user._id, user);

        } catch (error) {
            res.json({ status: "error", message: "No se pudieron cargar los documentos"});
        }
    }


    static getUsers = async (req, res) => {
        try {

            const users = await UsersServices.getUsers();

            const usersList = users.map(({first_name, last_name, email, age}) => ({first_name, last_name, email, age}));

            res.json({ status: "success", data: usersList });

        } catch (error) {
            res.json({ status: "error", message: "No se pudieron obtener los usuarios"});
        }
    }


    static deleteInactiveUsers = async (req, res) => {
        try {

            const users = await UsersServices.getUsers();

            const fechaActual = new Date();

            let deletedUsers = [];

            for (let i = 0; i < users.length; i++) {

                // Al restar dos fechas, el resultado está expresado en milisegundos.
                let milisegundosSinConexion = fechaActual - users[i].last_connection;

                // Para obtener la cantidad de días entre las dos fechas, se divide la
                // cantidad de milisegundos entre las dos fechas por la cantidad de milisegundos en un día.
                let diasSinConexion = Math.ceil(milisegundosSinConexion / (1000 * 60 * 60 * 24));

                // Si pasaron más de dos días sin conexión, se elimina el usuario.
                if (diasSinConexion > 2)
                {
                    let deletedUser = await UsersServices.deleteUser(users[i]._id);

                    deletedUsers.push(deletedUser);
                }

            }

            res.json({ status: "success", data: deletedUsers });

        } catch (error) {
            res.json({ status: "error", message: "No se pudieron eliminar los usuarios inactivos."});
        }
    }


    static deleteUser = async (req, res) => {
        try {

            const userId = req.params.uid;

            if (req.user._id.toString() === userId.toString()) {
                res.json({ status: "error", message: "No se puede eliminar el usuario actualmente logueado."});
            }
            else {
                const deletedUser = await UsersServices.deleteUser(userId);

                res.json({ status: "success", data: deletedUser });
            }

        }
        catch (error) {
            res.json({ status: "error", message: "No se pudo eliminar el usuario."});
        }
    }



}