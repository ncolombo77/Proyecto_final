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
                throw new Error(`El usuario con id ${ userId } no existe.`);
            }
        } catch (error) {
            logger.error(`Se produjo un error al buscar el empleado con el id ${userId}.`);
            throw error;
        }
    };


    async getByEmail(userEmail) {
        try {
            const user = await this.model.findOne({email: userEmail});
            if (user)
            {
                return user;
            }
            else
            {
                return null;
            }
        } catch (error) {
            logger.error(`Se produjo un error al buscar el empleado con el e-mail ${userEmail}.`);
            throw error;
        }
    };
}