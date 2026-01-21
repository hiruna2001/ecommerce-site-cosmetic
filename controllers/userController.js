
import axios from "axios";
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import OTP from "../models/otpModel.js";
import getDesignedEmail from "../lib/emailDesign.js";



dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
    },
});



export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User(
        {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword

        }
    )

    user.save().then(
        () => {
            res.json(
                {
                    message: "User Created Successfully"
                }
            )
        }
    ).catch(
        () => {
            res.json(
                {
                    message: "User Creation Failed"
                }
            )
        }
    )
}

export function loginUser(req, res) {
    User.findOne(
        {
            email: req.body.email
        }
    ).then(
        (user) => {
            if (user == null) {
                res.status(404).json(
                    {
                        message: "User Not Found"
                    }
                )
            } else {
                if (user.isBloked) {
                    res.status(401).json(
                        {
                            message: "Your Account Is Blocked"
                        }
                    )
                    return;
                }

                const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password);
                if (isPasswordMatching) {

                    const token = jwt.sign(
                        {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                            image: user.image,
                        },
                        process.env.JWT_SECRET_KEY
                    )



                    res.json(
                        {
                            message: "User Logged In Successfully",
                            token: token,
                            user: {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                isEmailVerified: user.isEmailVerified,
                                image: user.image
                            }
                        }
                    )
                } else {
                    res.status(401).json(
                        {
                            message: "User Login Failed"
                        }
                    )
                }
            }
        }
    )
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role != "admin") {
        return false;
    }
    return true
}

export function getUser(req, res) {

    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    else {
        res.json(
            req.user
        )
    }
}

export async function googleLogin(req, res) {

    const token = req.body.token;
    if (token == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    try {
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const googleUser = googleResponse.data

        const user = await User.findOne({ email: googleUser.email })
        if (user == null) {
            const newUser = new User({
                email: googleUser.email,
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                password: "abc",
                isEmailVerified: googleUser.email_verified,
                image: googleUser.picture
            })
            let savedUser = await newUser.save()
            const jwtToken = jwt.sign(
                {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                },
                process.env.JWT_SECRET_KEY
            );
            res.json({
                message: "User Logged In Successfully",
                token: jwtToken,
                user: {
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    role: savedUser.role,
                    isEmailVerified: savedUser.isEmailVerified,
                    image: savedUser.image,
                }

            })
            return;


        }
        else {
            //login
            if (user.isBloked) {
                res.status(401).json({
                    message: "Your Account Is Blocked"
                })
                return;
            }

            const jwtToken = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                },
                process.env.JWT_SECRET_KEY
            );
            res.json({
                message: "User Logged In Successfully",
                token: jwtToken,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image,
                }
            });
            return
        }



    } catch (error) {
        res.status(500).json({
            message: "Google Login Failed"
        })

    }



}

export async function getAllUsers(req, res) {

    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users"
        })

    }


}


export async function blockUnblockUser(req, res) {
    if (!isAdmin(req)) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    }
    if (req.user.email === req.params.email) {
        res.status(400).json({
            message: "You cannot block yourself"
        });
        return;
    }
    if (User.role === "admin") {
        return res.status(403).json({
            message: "Admins cannot be blocked"
        });
    }
    try {
        await User.updateOne({
            email: req.params.email
        }, {
            isBloked: req.body.isBloked
        })
        res.json({
            message: "User Blocked Successfully"
        })


    } catch (error) {
        res.status(500).json({
            message: "Failed to block user"
        })


    }

}

export async function sendOTP(req, res) {

    const email = req.params.email;
    if (email == null) {
        res.status(400).json({
            message: "Email is required"
        })
        return;
    }
    //100000 to 999999
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        await OTP.deleteMany({
            email: email
        });
        const newOTP = new OTP({
            email: email,
            otp: otp
        });
        await newOTP.save();
        await transporter.sendMail({
            from: `"Royal Cosmetic Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code - Royal Cosmetic",
            html: getDesignedEmail({
                otp: otp
            })
        });
        res.json({
            message: "OTP Sent to your Email Successfully"
        });


    } catch (error) {
        console.error("SEND OTP ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }

}

export async function changePasswordViaOTP(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    const password = req.body.password;
    try {

        const otpRecord = await OTP.findOne({
            email: email,
            otp: otp
        });
        if (otpRecord == null) {
            res.status(400).json({
                message: "Invalid OTP"
            });
            return;
        }
        await OTP.deleteMany({
            email: email
        });
        const hashPassword = bcrypt.hashSync(password, 10);

        await User.updateOne({
            email: email
        }, {
            password: hashPassword
        });
        res.json({
            message: "Password Changed Successfully"
        });


    } catch (error) {
        res.status(500).json({
            message: "Failed to change password"
        });
    }




}