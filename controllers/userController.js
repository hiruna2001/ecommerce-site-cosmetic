import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export function createUser(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    const user = new User(
        {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password:hashedPassword

        }
    )
    
    user.save().then(
        ()=>{
            res.json(
                {
                message: "User Created Successfully"
                }
        )
        }
    ).catch(
        ()=>{
            res.json(
                {
                    message:"User Creation Failed"    
                }           
    )
            })
        }

export function loginUser(req,res){
    User.findOne(
        {
            email: req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.json(
                    {
                        message: "User Not Found"
                    }
                )
            }else{
                const isPasswordMatching = bcrypt.compareSync(req.body.password,user.password);
                if(isPasswordMatching){

                    const token= jwt.sign(
                        {
                            email:user.email,
                            firstName:user.firstName,
                            lastName:user.lastName,
                            role:user.role,
                            isEmailVerified:user.isEmailVerified,
                        },
                        "jwt secret key"
                    )



                    res.json(
                        {
                            message: "User Logged In Successfully",
                            token:token
                        }
                    )
                }else{
                    res.json(
                        {
                            message: "User Login Failed"
                        }
                    )
                }
            }
        }
    )
}

export function isAdmin (req){
    if(req.user==null){
        return false;
    }
    if(req.user.role !="admin"){
        return false;
    }
    return true
}
