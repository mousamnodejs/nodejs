import express from "express";
import appointmentController from "../controller/appointmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const route = express.Router();

route
    .post('/book',authMiddleware,appointmentController.bookAppointment)
    .put("/status/:appointmentId", authMiddleware, appointmentController.updateAppointmentStatus)  // Update appointment status
    .get("/list",authMiddleware,appointmentController.getAppointmentsByUser)
    .get("/getDr/List",authMiddleware,appointmentController.getDoctorsList)
    export default route