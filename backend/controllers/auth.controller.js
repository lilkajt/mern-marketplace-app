import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
    const {username, email, password } = req.body;
    const trimmedUsername = username == undefined? '' : username.trim();
    const trimmedEmail = email == undefined? '' : email.trim();
    const trimmedPassword = password == undefined? '' : password.trim();
    if (trimmedUsername === '' || trimmedEmail === '' || trimmedPassword === '') {
        const error = new Error("Username, email and password are required!");
        error.statusCode = 400;
        return next(error);
    }
    if (trimmedPassword.length < 8) {
        const error = new Error("Password must be at least 8 characters!");
        error.statusCode = 400;
        return next(error);
    }
    if ( trimmedUsername.length < 4){
        const error = new Error("Username must be at least 4 characters!");
        error.statusCode = 400;
        return next(error);
    }
    if (await User.findOne({
        $or: [
            {username: trimmedUsername},
            {email: trimmedEmail}
        ]
    }) != null) {
        const error = new Error("Username or email is taken!");
        error.statusCode = 400;
        return next(error);
    }
    try {
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        next(error);
    }
}