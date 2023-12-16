import { usersModel } from "../../models/users.model.js"
import { addLogger } from "../../../helpers/logger.js";

const logger = addLogger();

export class UsersManagerMongo {
    constructor() {
        this.model = usersModel;
    };

    async save(user) {
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };


    async getById(userId) {
        try {
            const user = await this.model.findById(userId);
            if (user)
            {
                return user;
            }
            else
            {
                throw Error(`El usuario con id ${userId} no existe.`);
            }
        } catch (error) {
            logger.error(`Se produjo un error al buscar el empleado con el id ${userId}.`);
        }
    };


    async getByEmail(userEmail) {
        try {
            const user = await this.model.findOne({email: userEmail}).lean();
            if (user)
            {
                return user;
            }
            else
            {
                return null;
            }
        } catch (error) {
            logger.error(`Se produjo un error al buscar el usuario con el e-mail ${userEmail}.`);
        }
    };


    async update(userId, userInfo) {
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId, userInfo, {new: true});
            return userUpdated;
        } catch (error) {
            logger.error(`Se produjo un error al actualizar el usuario con el Id ${userId}.`);
            throw error;
        }
    };


    async getUsers() {
        try {
            const users = await this.model.find().lean();
            return users;
        } catch (error) {
            logger.error(`Se produjo un error al obtener los usuarios.`);
            throw error;
        }
    }


    async delete(id) {
        try {
            const userDeleted = await this.model.deleteOne({ _id : id });
            return userDeleted;
        } catch (error) {
            logger.error(`Se produjo un error al eliminar el usuario ${id}.`);
            throw error;
        }
    };


}