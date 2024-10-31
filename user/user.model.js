import mongoose, { Schema }from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        match: [/^(?=.{4,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/, 'Username must be between 3 and 16 characters long and must not contain special characters.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid.'],
        trim: true,
        //unique: [true, 'Email must be unique'], 
        // ==> Can't add custom messages to unique constraint, It only accepts a boolean value.
        unique: true, 
    },
}, { timestamps: true });


export default mongoose.model('User', userSchema);

