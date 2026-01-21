import express from "express";
import { blockUnblockUser, changePasswordViaOTP, createUser, getAllUsers, getUser, googleLogin, loginUser, sendOTP } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/all-users", getAllUsers);
userRouter.put("/block/:email", blockUnblockUser);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/change-password/", changePasswordViaOTP);

export default userRouter;
