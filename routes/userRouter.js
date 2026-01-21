import express from "express";
import { blockUnblockUser, changePasswordViaOTP, createUser, getAllUsers, getUser, googleLogin, loginUser, sendOTP, updatePassword, updateUserDate } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/all-users", getAllUsers);
userRouter.put("/block/:email", blockUnblockUser);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/change-password/", changePasswordViaOTP);
userRouter.put("/me", updateUserDate);
userRouter.put("/me/password", updatePassword);



export default userRouter;
