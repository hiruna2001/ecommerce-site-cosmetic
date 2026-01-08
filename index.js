import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js";

//Express backend framework importer
const app = express()
//Connection String
const dbConnection = "mongodb+srv://admin:232@cluster0.s0qftlq.mongodb.net/?appName=Cluster0"

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
            jwt.verify(token,"jwt secret key",
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



app.use("/users",userRouter)

app.use("/product",productRouter)

//backend starter
app.listen(5000,()=>
    {
        console.log("Server is running.....")
    }
)


