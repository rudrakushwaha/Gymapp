const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const authenticate = require("../middleware/authenticate")
// import User from "../model/UserSchema"

// to verify the same user after login we have to give user a unique id so that we can confirm it is the same user who has signed in
const jwt = require('jsonwebtoken')

const cookieParser = require("cookie-parser")
router.use(cookieParser())


require('../db/connection')
const User = require('../model/UserSchema')


router.get('/', (req, res) => {
    res.send("hello world from the server routerjs")

})
////////////USING ASYNC/////////
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body





    try {
        if (!name || !email || !phone || !work || !password || !cpassword) {
            return res.status(422).json({ error: "enter full details" })
            // res.send("enter full details")   
        } else {

            const userExist = await User.findOne({ email: email })

            if (userExist) {
                return res.status(422).json({ error: "email already exist" })
            } else if (password != cpassword) {
                return res.status(422).json({ error: "password are not matched" })
            } else {
                const user = new User({ name, email, phone, work, password, cpassword })
                //we have to HASH data and passwords here before saving it to database
                await user.save()
                res.json({ message: "user registered successfully" })
            }
        }




        //    if (userRegister) {
        //        res.status(201).json({ message: "user registered sucessfully" })
        //     }else{
        //         res.status(500).json({error:"failed to register"})
        //     }
    }
    catch (error) {
        console.log(error)
    }



    // console.log(req.body.name)
    // res.json({ message: req.body })  
})



//////////////////////////USING PROMISES//////////////////
// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body



//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "email already registered" })
//         // res.send("enter full details")
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "email already exist" })
//             }
//             const user = new User({
//                 name, email, phone, work, password, cpassword
//             })

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered sucessfully" })
//             }).catch((err) => {
//                 res.status(500).json({ error: "failed to registered" })

//             }).catch(err => { console.log(err) })

//         })

//     console.log(req.body.name)
//     res.json({ message: req.body })
// })





////////////LOGIN ROUTE
router.post('/signin', async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "please fill the data" })

        }

        const userLogin = await User.findOne({ email: email })
        // console.log(userLogin)   //this will print null if the user data is not found and the below written statement of user sign succ... will always be shown so let use if else statement

        if (userLogin) {
            //to check at the time of login whether the passowrd input by user matches with the registered password or not using bcrypt.compare function
            const isMatch = await bcrypt.compare(password, userLogin.password)



            if (!isMatch) {
                res.status(404).json({ error: "INAVLID CREDENTIALS" })
            } else {
                const token = await userLogin.generateAuthToken()
                // console.log(token)

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 2589200000),  //in milliseconds...30 din baad user ka jwttoken expire ho jayega
                    httpOnly: true   //to run on http as we are not secure
                })
                // res.status(200).json({ message: "user signin successfully" })
                res.send({message:"successfully login"})
            }
        } else {
            res.status(404).json({ error: "INAVLID CREDENTIALS" })

        }





    } catch (error) {
        console.log(error)
    }
})

//logout ka page
router.get('/logout',  (req, res) => {
    res.clearCookie('jwtoken', { path: '/' })    //agar kuch na ho to wo directly hamare homepage me chala jaye
    res.status(200).send("user logout")
});

// aboutus ka page
// router.get('/about', authenticate, (req, res) => {
//     res.send(req.rootUser)
// });

// // get user data for contact us and home page
// router.get('/getdata', authenticate, (req, res) => {
//     res.send(req.rootUser)
// });

// //logout ka page
// router.get('/logout', authenticate, (req, res) => {
//     res.clearCookie('jwtoken', { path: '/' })    //agar kuch na ho to wo directly hamare homepage me chala jaye
//     res.status(200).send("user logout")
// });


// router.post('/contact', authenticate, async (req, res) => {
//     // res.send(req.rootUser)
//     try {

//         const { name, email, phone, message } = req.body

//         if (!name || !email || !phone || !message) {
//             console.log("error in contact form")
//             return res.json({ error: "plzz filll the contact form" })
//             //    return alert("fill the form correctly")
//         }

//         const userContact = await User.findOne({ _id: req.userID })

//         if (userContact) {
//             const userMessage = await userContact.addMessage(name, email, phone, message)
//             await userContact.save()


//             res.status(201).json({ message: "user contact successfully" })
//         }


//     } catch (error) {
//         console.log(error)
//     }
// });
router.get('/exercises', authenticate, (req, res) => {
    res.send(req.rootUser)
});


module.exports = router;