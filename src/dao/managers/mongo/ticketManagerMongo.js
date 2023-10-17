import { ticketModel } from "../../models/tickets.model.js";
import { addLogger } from "../../../helpers/logger.js";

const logger = addLogger();

export class TicketManagerMongo {
    constructor() {
        this.model = ticketModel;
    };

    async createTicket(ticketInfo) {
        try {
            const result = await this.model.create(ticketInfo);
            return result;
        }
        catch (error) {
            logger.error(error);
            throw(error);
        }
    }
}