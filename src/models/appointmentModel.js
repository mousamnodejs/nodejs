import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["booked", "canceled"], default: "booked" },
    reason :{type: String, required: true }
}, { timestamps: true });

const appointmentsSchema= mongoose.model("Appointment", AppointmentSchema);
export default appointmentsSchema
