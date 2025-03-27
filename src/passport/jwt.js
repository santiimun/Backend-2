import passport from "passport";
import "dotenv/config";
import { userService } from "../services/user.services.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";


const verifyToken = async (jwt_payload, done) => {
    //req.user = jwt_payload
    if (!jwt_payload) return done(null, false, { messages: "Usuario inexistente" });
    return done(null, jwt_payload);
};

const cookieExtractor = (req) => {
    return req.cookies.token;
};

const strategyCookiesConfig = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.SECRET_KEY,
};

passport.use('current', new JwtStrategy(strategyCookiesConfig, verifyToken));


passport.serializeUser((user, done) => {
    try {
        done(null, user._id);
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userService.getById(id);
        return done(null, user);
    } catch (error) {
        done(error);
    }
});


export const authenticateJWT = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    });
};