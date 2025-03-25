import MongoDao from "./mongo.dao";
import TicketModel from "./models/ticket.model";

export default class TicketDao extends MongoDao{
    constructor(){
        super(TicketModel);
    }
}