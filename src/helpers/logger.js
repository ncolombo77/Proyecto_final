import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const currentEnvironment = process.env.LOGGER;

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

const devLogger = winston.createLogger({
    levels: customLevels,
    transports: [
         new winston.transports.Console({ level: "debug"})
    ]
});


const prodLogger = winston.createLogger({
    levels: customLevels,
    transports: [
         new winston.transports.File({filename: "./logs/errors.log", level: "info" })
    ]
});


export const addLogger = () => {
    let logger;

    if (currentEnvironment === "development")
        logger = devLogger;
    else
        logger = prodLogger;

    return logger;
}
