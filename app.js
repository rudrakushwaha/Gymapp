const express = require('express')
// const cookieParser = require('cookie-parser')
const app = express();
const dotenv= require("dotenv")   //requiring dotenv
// app.use(cookieParser())



//including or using dotenv to secure our necessary or important data
dotenv.config({path:"./config.env"})

require("./db/connection")
// const User=require('./model/UserSchema')


/////////////MIDDLEWARE/////////////
//hamara jo app hai wo json nhi smjhta to jo ham post krte hai wo show nhi krta undefined batata hai..to ham middleware use kr rhe hai taki wo json object me covert hoke hame show ho ske
app.use(express.json())

// we link the router files to make the route easy
app.use(require('./router/auth'))  //using middleware
//////////////////////////////////////

////////////CORS POLICY//////
app.use(cors({
    origin:["http://localhost:3000","https://hgym.onrender.com/"],
}));



//fetching data from config.env file ...to create config.env file we have use  type null > config.env  in the terminal
// DB=process.env.DATABASE  
PORT=process.env.PORT || 5000 ;




// middleware are used to do middle task suppose you want to show about page to the respective user but first u will check whether the user is login or not then to check this which is a mid task we use middleware
// const middleware=(req,res, next )=>{
//     console.log("hello i am middleware")
//     next()
// }
// middleware()

// app.get('/',function(req,res){
//     res.send("hello world from the server appjs")
// });

// app.get('/about',middleware,function(req,res){
//     res.send("hello about world")
// });

// console.log("hello")


app.listen(PORT, ()=>{
    console.log(`server running at port ${PORT}`)
})

