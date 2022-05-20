const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const publsherCancelHistorySchema=mongoose.Schema({
    rideId:
    {
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    publisherId:{type:Schema.Types.ObjectId,ref:"publishride"},
    bookerId:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }]

})

module.exports=mongoose.model("publishercancelhistory",publsherCancelHistorySchema);

