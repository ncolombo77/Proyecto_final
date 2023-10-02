import { ticketModel } from "../../models/tickets.model.js";

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
            console.log(error);
            throw(error);
        }
    }
}