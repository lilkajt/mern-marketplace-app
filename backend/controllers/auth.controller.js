import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const {username, email, password } = req.body;
    const trimmedUsername = username == undefined? '' : username.trim();
    const trimmedEmail = email == undefined? '' : email.trim();
    const trimmedPassword = password == undefined? '' : password.trim();
    const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (trimmedUsername === '' || trimmedEmail === '' || trimmedPassword === '') {
        return next(errorHandler(400, "Username, email and password are required!"));
    }
    if (trimmedPassword.length < 8) {
        return next(errorHandler(400, "Password must be at least 8 characters!"));
    }
    if (passRegex.test(trimmedPassword) === false) {
        return next(errorHandler(400, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character!"));
    }
    if ( trimmedUsername.length < 4){
        return next(errorHandler(400, "Username must be at least 4 characters!"));
    }
    if (await User.findOne({
        $or: [
            {username: trimmedUsername},
            {email: trimmedEmail}
        ]
    }) != null) {
        return next(errorHandler(400, "Username or email is taken!"));
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