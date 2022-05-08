const PublisherHistory=require("../model/PublisherHistory");

exports.viewPublisherHistory= (request, response) => {
    PublisherHistory.find({bookerId:request.params.publisherId})
    .then(publisherHistory =>{
        return response.status(200).json(publisherHistory);
    })
    .catch(err =>{
        return response.status(500).json(err);
    });
};