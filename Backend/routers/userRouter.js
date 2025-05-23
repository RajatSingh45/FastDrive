import express from 'express'
import {body} from 'express-validator'
import { userLogin, userRegister, userProfile, userLogout } from '../controller/userController.js';
import userAuth from '../middleware/userAuth.js'

const userRouter=express.Router();

//routing Register api
userRouter.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min:3}).withMessage("minnimum length of firstname should be three"),
    body('password').isLength({min:6}).withMessage("Password should be of minimum length six")
],userRegister)

//routing login api
userRouter.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:6}).withMessage("Password should be of minimum length six")
],userLogin)

//routing user profile
userRouter.get('/profile',userAuth,userProfile);

//routing logout api
userRouter.get('/logout',userAuth,userLogout);


export default userRouter