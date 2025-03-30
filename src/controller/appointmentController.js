import { Appointment, User } from "../models/index.js";
import apiResponse from "../helper/apiResponse.js";
import message from "../helper/message.js";

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;
        const patientId = req.userId;

        // Validate input
        if (!doctorId || !date || !time) {
            return apiResponse.badRequest(res, message.APPOINTMENT.REQUIRED_FIELDS);
        }

        // Check if appointment slot is already booked
        const existingAppointment = await Appointment.findOne({ 
            doctorId, 
            date, 
            time 
        });
        
        if (existingAppointment) {
            return apiResponse.badRequest(res, message.APPOINTMENT.SLOT_BOOKED);
        }

        // Create new appointment
        const appointment = new Appointment({ 
            patientId, 
            doctorId, 
            date, 
            time,
            reason,
            status: 'booked' 
        });
        
        await appointment.save();

        return apiResponse.success(res, message.APPOINTMENT.BOOK_SUCCESS, appointment);
    } catch (error) {
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["booked", "confirmed", "canceled", "completed"].includes(status)) {
            return apiResponse.badRequest(res, message.APPOINTMENT.INVALID_STATUS);
        }

        // Find and update appointment
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { 
                status, 
                updatedAt: new Date() 
            },
            { new: true }
        ).populate('patientId doctorId');

        if (!appointment) {
            return apiResponse.notFound(res, message.APPOINTMENT.NOT_FOUND);
        }

        return apiResponse.success(res, message.APPOINTMENT.STATUS_UPDATED, appointment);
    } catch (error) {
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

const getAppointmentsByUser = async (req, res) => {
    try {
        const { userId, role } = req;
        let appointments;
    
        if (role === 'doctor') {
            appointments = await Appointment.find({ doctorId: userId })
                .populate('patientId', 'fName lName email phoneNumber');
        } else {
            appointments = await Appointment.find({ patientId: userId })
                .populate('doctorId', 'fName lName specialty');
        }

        return apiResponse.success(res, message.APPOINTMENT.RETRIEVED, appointments);
    } catch (error) {
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

const getDoctorsList = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" })
            .select('_id fName lName specialty');
            
        return apiResponse.success(res, message.DOCTOR.RETRIEVED, doctors);
    } catch (error) {
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

export default {
    bookAppointment,
    updateAppointmentStatus,
    getAppointmentsByUser,
    getDoctorsList
};