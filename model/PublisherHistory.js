const mongoose=require('mongoose');

const schema=mongoose.Schema;

const publisherSchema=new mongoose.Schema({
    publisherId:{type:schema.Types.ObjectId,required:true,ref:'user'},
    bookerId:[
        {type:schema.Types.ObjectId,ref:'user'}
    ]    
});

module.exports=mongoose.model('publisherhistory',publisherSchema);