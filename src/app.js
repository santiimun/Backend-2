import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from "connect-mongo"
import passport from "passport";

import "dotenv/config";
import "./passport/jwt.js"

// Importación de enrutadores
//import routerCarts from "./routes/carts.router.js";
//import routerProducts from "./routes/products.router.js";
//import routerViewHome from "./routes/home.view.router.js";
import routerUsers from "./routes/user.router.js"


const app = express();
const PORT = 8080;


const storeConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_URL,
        crypto: { secret: process.env.SECRET_KEY },
        ttl: 180,
    }),
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 180000 }
    };



app.use("/api/public", express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(session(storeConfig));

app.use(passport.initialize());
app.use(passport.session());



configHandlebars(app);

connectDB();


app.use("/api", routerUsers);



app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "Error 404" });
});


const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});


configWebsocket(httpServer);