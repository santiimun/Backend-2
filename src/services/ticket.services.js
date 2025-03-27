import TicketModel from "../daos/mongodb/models/ticket.model.js";
import Services from "./service.manager.js";

class TicketServices extends Services {
    async createTicket(userEmail, totalAmount) {
        const ticket = new TicketModel({
            purchaser: userEmail,
            amount: totalAmount
        });

        await ticket.save();
        return ticket;
    }
}

export const ticketServices = new TicketServices();