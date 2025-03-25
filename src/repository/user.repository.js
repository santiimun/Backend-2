import { userDao } from "../daos/mongodb/user.dao.js";
import UserDto from "../dtos/user.dto.js";

class UserRepository {
    constructor(){
        this.dao = userDao;
    }
    
    privateData = (req, res) => {
        const user = req.user;
        if (!user)
            throw new Error("No se puede acceder a los datos del usuario");

        const userDto = new UserDto(user);

        return res.json({
            usuario: userDto,
        });
    };
}

export const userRepository = new UserRepository();


