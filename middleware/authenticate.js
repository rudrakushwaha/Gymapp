const jwt=require('jsonwebtoken')
const User = require('../model/UserSchema')
// import Logout from '../../client/src/components/Logout'



const authenticate =async(req,res,next)=>{
    try {
        const token = req.cookies.jwtoken
        const verifyToken= jwt.verify(token,process.env.SECRET_KEY)
        // console.log(verifyToken)   // it will print id like this { _id: '646b57fffe414f98a00e983e', iat: 1685174295 } in console
        
        const rootUser= await User.findOne({_id:verifyToken._id,"tokens.token":token})
        // console.log(rootUser)

        if(!rootUser){
            throw new Error("User not Found")
        }

        req.token=token
        req.rootUser=rootUser
        req.userID=rootUser._id

    } catch (error) {
        res.status(401).send("unauthorized:No token provided")
        console.log(error)
    }

    next()
}

module.exports=authenticate