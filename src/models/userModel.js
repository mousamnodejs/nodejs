import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    lName:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender:{ type: String, required: true },
    phoneNumber:{type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["doctor", "patient"], required: true },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const userSchema= mongoose.model("User", UserSchema);
export  default userSchema
