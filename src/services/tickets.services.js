import { ticketDao } from "../dao/index.js";

export class TicketsService {
    static createTicket = async (ticketInfo) => {
        return await ticketDao.createTicket(ticketInfo);
    };
}