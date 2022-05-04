const BookRide= require("../model/BookRide");
const { validationResult } = require("express-validator");

exports.bookRide= (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

};