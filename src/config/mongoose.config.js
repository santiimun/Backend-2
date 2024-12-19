import { connect, Types }  from "mongoose";

export const connectDB = async ()=>{
    const URL = "mongodb+srv://Santiago:12345@cluster0.i7iqg.mongodb.net/proyecto"; 

    try{
        await connect(URL);
        console.log("conectado a MongoDB");
        
    } catch (error){
        console.log("Erro al conectar con MongoDB", error.message);
    }
};

export const validateId = (id) =>{
    return Types.ObjectId.isValid(id);
}