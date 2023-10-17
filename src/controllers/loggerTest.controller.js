import { addLogger } from "../helpers/logger.js";

const logger = addLogger();


export class LoggerTestController {

    static testLogger = async (req, res) => {
        logger.fatal("Testeo de log: error fatal.");
        logger.error("Testeo de log: error.");
        logger.warning("Testeo de log: warning.");
        logger.info("Testeo de log: info.");
        logger.http("Testeo de log: http.");
        logger.debug("Testeo de log: debug.");

        res.json({ status: "success", data: "Testeo de logging finalizado." });
    };

}