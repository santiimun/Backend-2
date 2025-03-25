import jwt from "jsonwebtoken";
import "dotenv/config";
import { userDao } from "../daos/mongodb/user.dao.js";
import Services from "./service.manager.js";
import { createHash, isValidPassword } from "../utils/brcypt.js";
import { cartService } from "./cart.services.js";
import  { userRepository } from "../repository/user.repository.js";

class UserService extends Services {
    constructor() {
        super(userDao)
    }
    register = async (user) => {
        try {
            const { email, password} = user;
            const existUser = await this.getUserByEmail(email);
            if (existUser) throw new Error("User already exists");
            const cartUser = await cartService.create();
            const newUser = await this.dao.register({
                ...user,
                password: createHash(password),
                cart: cartUser._id
            });
            return newUser;
        } catch (error) {
            throw error;
        }
    };
    
    login = async (user) => {
        try {
            const { email, password } = user;
            const userExist = await this.getUserByEmail(email);
            if (!userExist) throw new Error("User not found");
            const passValid = isValidPassword(password, userExist);
            if (!passValid) throw new Error("incorrect credentials");
            return this.generateToken(userExist);
        } catch (error) {
            throw error;
        }
    };

    getUserByEmail = async (email) => {
        try {
            return await this.dao.getByEmail(email);
        } catch (error) {
            throw new Error(error);
        }
    };

    generateToken = (user) => {
        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };
    
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "20m" });
    };


    getUser = async (req, res) => {
        return await userRepository.privateData(req, res);
    }
}

export const userService = new UserService();