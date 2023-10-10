import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) => {

    switch(error.code) {
        case EError.ROUTING_ERROR:
            res.status(401).json({status: "error", error: error});
            break;
        case EError.AUTH_ERROR:
            res.status(401).json({status: "error", error: error});
            break;
        case EError.INVALID_JSON:
            res.status(401).json({status: "error", error: error});
            break;
        case EError.DATABASE_ERROR:
            res.status(500).json({status: "error", error: error});
            break;
        case EError.INVALID_PARAM:
            res.status(401).json({status: "error", error: error});
            break;
        default:
            res.status(500).json({status: "error", error: "Error desconocido."});
    };
}