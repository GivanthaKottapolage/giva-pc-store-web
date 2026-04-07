import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"

const mongoURI = "mongodb+srv://admin:20030329@cluster0.kp0w231.mongodb.net/?appName=Cluster0"

mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Connected to mongodb cluster")
    }
)

const app = express()

app.use(express.json())

app.use(
    (req,res,next)=>{

        const AuthorizationHeader = req.header("Authorization")

       if(AuthorizationHeader!=null){

        const token = AuthorizationHeader.replace("Bearer ","")

        console.log(token)

        jwt.verify(token,"Giva20030329",
            (error,content)=>{

                if(content == null){
                    console.log("invalid token")

                    res.json({
                        message : "Invalid token"
                    })
                    

                }else{
                    console.log(content)
                    req.user = content
                    next()
                }

                
            }
        )

       }else{


            next()

       }

        
    })

app.use("/users",userRouter)
app.use("/products",productRouter)


app.listen(5000,
    ()=>{
        console.log("server is running")
    }
)