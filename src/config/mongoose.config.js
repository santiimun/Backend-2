import { connect, Types }  from "mongoose";
import "dotenv/config"

export const connectDB = async ()=>{

    try{
        await connect(process.env.MONGO_DB_URL);
        console.log("conectado a MongoDB");
        
    } catch (error){
        console.log("Erro al conectar con MongoDB", error.message);
    }
};

export const validateId = (id) =>{
    return Types.ObjectId.isValid(id);
}