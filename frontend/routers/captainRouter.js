import express from 'express'
import {body} from 'express-validator'
import { captainLogin, captainRegister, captainProfile, captainLogout } from '../controller/captainController.js'
import captainAuth from '../middleware/captainAuth.js'

const captainRouter=express.Router();

//routing register api
captainRouter.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min:3}).withMessage("minimum length of firstname should be three"),
    body('password').isLength({min:6}).withMessage("Password should be of minimum length six"),
    body('veichle.color').isLength({min:3}).withMessage("minimum length of veichle color should be three"),
    body('veichle.plate').isLength({min:3}).withMessage("minimum length of veichle plate number should be three"),
    body('veichle.capacity').isInt({min:1}).withMessage("minimum capacity of veichle should be one"),
    body('veichle.veichleType').isIn(['car','motorcycle','auto']).withMessage("Invalid vechile type")
],captainRegister)

//routing login api
captainRouter.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:6}).withMessage("Password should be of minimum length six")
],captainLogin)

//routing profile api
captainRouter.get('/profile',captainAuth,captainProfile);

//routing logput api
captainRouter.get('/logout',captainAuth,captainLogout);

export default captainRouter
