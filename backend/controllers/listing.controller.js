import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res
        .status(201)
        .json(newListing);
    } catch (error) {
        next(error);
    }
};