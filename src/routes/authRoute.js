import express from "express";
import authController from "../controller/authController.js";

const route = express.Router();

route
    .post('/register',authController.register)
    .post('/login',authController.login)
    .get('/getAllDoctors/list',authController.getAllDoctors)
    export default route