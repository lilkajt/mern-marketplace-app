import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const {username, email, password } = req.body;
    // fix regex to trim whitespaces, dont user trim
    const trimmedUsername = username == undefined? '' : username.trim();
    const trimmedEmail = email == undefined? '' : email.trim();
    const trimmedPassword = password == undefined? '' : password.trim();
    const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    // fix when login with google, error passing empty form
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

export const signin = async (req, res, next) => {
    const {email, password } = req.body;
    const trimmedEmail = email == undefined? '' : email.trim();
    const trimmedPassword = password == undefined? '' : password.trim();
    if (trimmedEmail === '' || trimmedPassword === '') {
        return next(errorHandler(400, "Email and password are required!"));
    }
    const user = await User.findOne({email: trimmedEmail});
    if (!user){
        return next(errorHandler(404, "User not found!"));
    }
    try {
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return next(errorHandler(401, "Incorrect email or password!"));
        }
        const {password: p, ...rest} = user._doc;
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res
        .status(200)
        .cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 3600000)})
        .json(rest);
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const {name, email, photo} = req.body;
    try {
        const user = await User.findOne( {email: email} );
        if (user){
            const {password: p, ...rest} = user._doc;
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            res
            .status(201)
            .cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 3600000)})
            .json(rest);
        } else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 12);
            const newUser = new User({
                username: name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-8),
                email: email,
                password: hashedPassword,
                avatar: photo
            });
            await newUser.save();
            const {password: p, ...rest} = newUser._doc;
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
            res
            .status(201)
            .cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 3600000)})
            .json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res
        .status(200)
        .json({ message: 'User has been logged out!' });
    } catch (error) {
        next(error);
    }
}