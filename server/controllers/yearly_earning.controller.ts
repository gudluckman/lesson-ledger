import YearlyEarning from "../mongodb/models/yearly_earning";
import User from "../mongodb/models/user";
import { Request, Response } from "express";
import { getErrorMessage } from "../utils/error";
import { getQueryNumber, getQueryString } from "../utils/query";

const getYearlyEarning = async (req: Request, res: Response) => {
    const { _end, _order, _start, _sort } = req.query;
    const sortField = getQueryString(_sort);
    const sortOrder = getQueryString(_order);
    const limit = getQueryNumber(_end);
    const skip = getQueryNumber(_start);

    try {
        let query = {};
        const email = getQueryString(req.query.email);
        if (email) {
            const user = await User.findOne({ email }).select("_id");
            query = user ? { tutor: user._id } : { tutor: null };
        }

        const count = await YearlyEarning.countDocuments(query);
        let yearlyEarningsQuery = YearlyEarning.find(query);

        if (limit !== undefined) {
            yearlyEarningsQuery = yearlyEarningsQuery.limit(limit);
        }

        if (skip !== undefined) {
            yearlyEarningsQuery = yearlyEarningsQuery.skip(skip);
        }

        if (sortField) {
            yearlyEarningsQuery = yearlyEarningsQuery.sort({
                [sortField]: sortOrder === "desc" ? -1 : 1,
            });
        }

        const yearlyEarnings = await yearlyEarningsQuery;
        
        res.header("x-total-count", count.toString());
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(yearlyEarnings);
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) });
    }
};

export { getYearlyEarning };
