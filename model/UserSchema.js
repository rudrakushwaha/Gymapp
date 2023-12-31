const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
     phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    
})



userSchema.pre('save',async function(next){
    console.log("hi from middleware")
    if(this.isModified('password')){
        //hashing password using bcrypt function hash directly after user input
        this.password= await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next()
}) 

userSchema.methods.generateAuthToken = async function(){
    try {
         let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});   //concat array element ..actually concatenating the objects and storing it inn a single array
        await this.save()
        return token
    } catch (error) {
        console.log(error)
    }
}


const User = mongoose.model("user",userSchema)

module.exports=User