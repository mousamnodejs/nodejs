import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import apiResponse from "../helper/apiResponse.js";
import { User } from "../models/index.js";
import message from "../helper/message.js";

const register = async (req, res) => {
    try {
        const { phoneNumber, gender, lName, fName, email, password, role } = req.body;

        // Validate required fields
        if (!email || !password || !role || !fName || !lName || !gender || !phoneNumber) {
            return apiResponse.badRequest(res, message.AUTH.ALL_FIELDS_REQUIRED);
        }

        // Validate role
        if (!['patient', 'doctor'].includes(role)) {
            return apiResponse.badRequest(res, message.AUTH.INVALID_ROLE);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return apiResponse.badRequest(res, message.AUTH.INVALID_EMAIL);
        }

        // Validate password strength
        if (password.length < 8) {
            return apiResponse.badRequest(res, message.AUTH.PASSWORD_LENGTH);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return apiResponse.badRequest(res, message.AUTH.EMAIL_EXISTS);
        }

        // Hash password
       

        // Create user
        const user = await User.create({ 
            phoneNumber,
            gender,
            lName, 
            fName, 
            email, 
            password, 
            role 
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // Prepare response data
        const userData = {
            _id: user._id,
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            role: user.role,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            token
        };

        return apiResponse.created(res, message.AUTH.REGISTRATION_SUCCESS, userData);

    } catch (error) {
        console.error("Registration error:", error);
        return apiResponse.serverError(res, message.AUTH.REGISTRATION_FAILED);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).lean();
        if (!user) return apiResponse.badRequest(res, message.AUTH.EMAIL_NOT_FOUND);

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return apiResponse.badRequest(res, message.AUTH.PASSWORD_MISMATCH);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                email: user.email
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );
        
        // Prepare response data
        const userData = {
            _id: user._id,
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            role: user.role,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            token
        };

        return apiResponse.success(res, message.AUTH.LOGIN_SUCCESS, userData);
    } catch (error) {
        console.error("Login error:", error);
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find(
            { role: "doctor" },
            "fName lName email specialty createdAt"
        ).lean();

        if (!doctors.length) {
            return apiResponse.notFound(res, message.DOCTOR.NOT_FOUND);
        }

        return apiResponse.success(res, message.DOCTOR.RETRIEVED, doctors);
    } catch (error) {
        console.error("Get doctors error:", error);
        return apiResponse.serverError(res, message.SERVER_ERROR);
    }
};

export default { 
    login,
    register,
    getAllDoctors 
};