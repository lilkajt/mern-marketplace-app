import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res.json({ message: "User Controller Works!" });
}

export const updateUser = async (req, res, next) => {
    if ( req.user.id !== req.params.id ) return next(errorHandler(403, 'Forbidden'));
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 12);
        }
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res
        .status(200)
        .json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if ( req.user.id !== req.params.id ) return next(errorHandler(403, 'Forbidden'));
    try {        
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res
        .status(200)
        .json({ message: 'User has been deleted!' });
    } catch (error) {
        next(error);
    }
};