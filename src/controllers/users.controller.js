import { UsersServices } from "../services/users.services.js";

export class UsersController {

    static modifyRole = async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await UsersServices.getUserById(userId);
            const userRole = user.role;

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
        catch (error) {
            res.json({status: "error", message: error.message});
        }
    };

}