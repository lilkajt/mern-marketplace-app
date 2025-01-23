import mongoose from "mongoose";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({ message: "User Controller Works!" });
}