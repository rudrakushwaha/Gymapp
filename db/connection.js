const mongoose = require("mongoose")

//fetching data from config.env file ...to create config.env file we have use  type null > config.env  in the terminal
DB=process.env.DATABASE

mongoose.connect(DB).then(()=>{
    console.log("connection successful")
}).catch((err)=>{console.log("no connection")
    console.log(err)
}
)