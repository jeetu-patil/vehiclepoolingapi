const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');

const app = express();
const path = require("path")
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));

const adminRouter=require("./router/AdminRouter");
const placeRouter=require("./router/PlaceRouter");
const userRouter = require("./router/UserRouter");

mongoose.connect("mongodb+srv://jitu:jitu%40123@cluster0.5msi4.mongodb.net/carpooling?retryWrites=true&w=majority")
.then(()=>{
    app.use("/user",userRouter); 
    app.use("/admin",adminRouter);
    app.use("/place",placeRouter);
})
.catch(err => {

});

app.listen(3000,()=>{
    console.log("Server Started At Port 3000");
});