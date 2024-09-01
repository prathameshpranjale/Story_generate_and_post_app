
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false
        },
        profilePicture: {
            // cloudinary
            type: String,
            default: ''
        }

    },
    {
        timestamps: true
    }
);

// Pre-save middleware to hash passwords
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        if (!this.password) {
            throw new Error('Password is not set');
        }
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);

