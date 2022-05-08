const BookerHistory=require("../model/BookerHistory");
const User=require("../model/User");

exports.viewBookerHistory= (request, response) => {
    BookerHistory.find({bookerId:request.params.bookerId})
    .then(bookerHistory =>{
        return response.status(200).json(bookerHistory);
    })
    .catch(err =>{
        return response.status(500).json(err);
    });
};

