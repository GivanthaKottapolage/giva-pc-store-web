import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser(req,res){

    const data = req.body

    const hashedPassword = bcrypt.hashSync(data.password, 10)

    //res.json({hashedPassword})

    const  user =  new User({
        email : data.email,
        firstName : data.firstName,
        lastName : data.lastName,
        password : hashedPassword,
        role : data.role
    })

    // const user = new User(req.body)

    user.save().then(
        ()=>{
            res.json({
                message : "User Created Successfully"
            })
        }
    )
}

export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.find({email : email}).then(
        (users)=>{
            if(users[0]==null){
                res.json({
                    message : "user ot found"
                })
            }else{
                const user = users[0]
            
                const isPasswordCorrect = bcrypt.compareSync(password,user.password)

                const payLoad = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image
                };

                const token = jwt.sign(payLoad,"Giva20030329")

                if(isPasswordCorrect){
                    res.json({
                        message : "Login Successfull",
                        token : token
                    })
                }else{
                    res.json({
                        message : "Invalid Password"
                    })
                }

                // res.json({
                //     matching : isPasswordCorrect
                // })
            }
        }
    )
}

export function isAdmin(req){
    if(req.user==null){
        
        return false 
    }
    if(req.user.role!= "admin"){
        
        return false
    }

    return true

}