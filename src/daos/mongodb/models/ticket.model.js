import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true, 
        default: function () {
            return Math.random().toString(36).substr(2, 9).toUpperCase();
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now 
    },
    amount: {
        type: Number,
        required: true 
    },
    purchaser: {
        type: String,
        required: true
    }
    },
    {
        timestamps: false,
    });

const TicketModel = model("tickets", ticketSchema);

export default TicketModel;