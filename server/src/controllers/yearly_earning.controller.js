import YearlyEarning from "../mongodb/models/yearly_earning.js";

const getYearlyEarning = async (req, res) => {
    const { _end, _order, _start, _sort } = req.query;

    const query = {};

    try {
        const count = await YearlyEarning.countDocuments(query);
        const yearlyEarnings = await YearlyEarning.find(query)
            .limit(parseInt(_end))
            .skip(parseInt(_start))
            .sort({ [_sort]: _order });
        
        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(yearlyEarnings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getYearlyEarning };