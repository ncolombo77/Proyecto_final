import { userDao } from "../dao/index.js";

export class UsersServices {

    static getUserByEmail = async (username) => {
        return await userDao.getByEmail(username);
    };


    static getUserById = async (userId) => {
        return await userDao.getById(userId);
    };


    static saveUser = async (user) => {
        return await userDao.save(user);
    };


    static updateUser = async(userId, user) => {
        return await userDao.update(userId, user);
    };


    static getUsers = async() => {
        return await userDao.getUsers();
    }


    static deleteUser = async (userId) => {
        return await userDao.delete(userId);
    }

}