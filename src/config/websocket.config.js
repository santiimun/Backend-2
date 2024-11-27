import { Server } from "socket.io";
import ProductsManager from "../managers/ProductsManager.js";

const productsManager = new ProductsManager();


// Configura el servidor Socket.IO
export const config = (httpServer) => {
    // Crea una nueva instancia del servidor Socket.IO
    const socketServer = new Server(httpServer);

    // Escucha el evento de conexión de un nuevo cliente
    socketServer.on("connection", async (socket) => {
        socketServer.emit("products-list", { products: await productsManager.getAll()});
        // Escucha el evento de conexión de un nuevo cliente
        socket.on("message", (data) => {
            const { user, message } = data;

            messages.push({ user, message });

            socketServer.emit("message-log", { messages });
        });

        socket.on("authenticated", (data) => {
            socket.broadcast.emit("new-user-connected", data);
        });


        //Para agregar y eliminar un producto
        
        socket.on("insert-product", async (data)=>{
            try{
                await productsManager.insertOne(data);

                socketServer.emit("products-list", { products: await productsManager.getAll()})
            }catch(error){
                socketServer.emit("error-message", { message: error.message});
            }
        })

        socket.on("delete-product", async (data)=>{
            try{
                await productsManager.deleteOneById(data.id);

                socketServer.emit("products-list", { products: await productsManager.getAll()})
            }catch(error){
                socketServer.emit("error-message", { message: error.message});
            }
        })
    });
};