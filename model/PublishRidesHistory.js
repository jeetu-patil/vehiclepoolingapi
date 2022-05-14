const mongoose=require('mongoose');

const schema=mongoose.Schema;

const publishRideSchema=new mongoose.Schema({
    publisherId:{type:schema.Types.ObjectId,required:true},
    booker:[
        {
            type:schema.Types.ObjectId,
            ref:"user"
        }
    ]
});

module.exports=mongoose.model('publishridehistory',publishRideSchema);