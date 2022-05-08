const mongoose=require('mongoose');

const schema=mongoose.Schema;

const bookerSchema=new mongoose.Schema({
    bookerId:{type:schema.Types.ObjectId,required:true,ref:'user'},
    publisherId:[
        {type:schema.Types.ObjectId,ref:'user'}
    ]    
},{timeStamps:true});

module.exports=mongoose.model('bookerhistory',bookerSchema);