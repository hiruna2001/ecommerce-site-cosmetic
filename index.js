import dotenv from "dotenv"
dotenv.config()

import express from "express";

import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken"
import cors from "cors"




import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

//Express backend framework importer
const app = express()
//Connection String
const dbConnection = process.env.MONGO_URI

app.use(cors())

//Database connecter
mongoose.connect(dbConnection).then(
    ()=>{
        console.log("Database Connected....")
    }
).catch(
    ()=>{
        console.log("Database Not Connected!!!!!!")
    }
)
//Request Handler
app.use(express.json())


//Authentication
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization");
        
        if(token !=null){
            token = token.replace("Bearer ","")
            jwt.verify(token,process.env.JWT_SECRET_KEY,
                (err,decoded)=>{
                    if(decoded==null){
                        res.json({
                            message:"Unauthorized try again"
                        })
                        return
                    }
                    else{
                        req.user = decoded;

                    }
                    
                }
            )
        }
        next();

    }
)



app.use("/api/users",userRouter)

app.use("/api/product",productRouter)
app.use("/api/orders",orderRouter)

//backend starter
app.listen(5000,()=>
    {
        console.log("Server is running.....")
    }
)


