const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app = express();
const path=require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));

const adminRouter=require("./router/AdminRouter");
const placeRouter=require("./router/PlaceRouter");
const userRouter = require("./router/UserRouter");
const publishRideRouter=require("./router/PublishRideRouter");
const bookRideRouter = require("./router/BookRideRouter");
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://jitu:jitu%40123@cluster0.5msi4.mongodb.net/carpooling?retryWrites=true&w=majority")
.then(()=>{
    console.log("database is Connected");
    app.use("/user",userRouter); 
    app.use("/admin",adminRouter);
    app.use("/place",placeRouter);
    app.use("/publishride",publishRideRouter);
    app.use("/bookride",bookRideRouter);
})
.catch(err => {

});

app.listen(3000,()=>{
    console.log("Server Started At Port 3000");
});