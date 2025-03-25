import express from "express";
import { connectDB } from "./config/mongoose.config.js";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from "connect-mongo"
import passport from "passport";
import "dotenv/config";
import "./passport/jwt.js"
import Routers from "./routes/index.js"

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



connectDB();


app.use("/api", Routers);



app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "Error 404" });
});


const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

