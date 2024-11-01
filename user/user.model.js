import mongoose, { Schema } from "mongoose";
import { usernameErr } from "./user.errorMessage.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      match: [/^(?=.{4,16}$)[a-z0-9]+(?:[._][a-z0-9]+)*$/, usernameErr],
      unique: true,
      minLength: 4,
      maxlength: 16,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      // match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/, 'Password must be 8 characters long and contain atleast one uppercase, one lowercase, one number and one special character.'],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
        "Email must be valid.",
      ],
      trim: true,
      //unique: [true, 'Email must be unique'],
      // ==> Can't add custom messages to unique constraint, It only accepts a boolean value.
      unique: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "Phone number must be valid."],
      trim: true,
      //unique: [true, 'Phone number must be unique'],
      // ==> Can't add custom messages to unique constraint, It only accepts a boolean value.
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function (next) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  if (this.isModified("password") && !passwordRegex.test(this.password)) {
    this.invalidate(
      "password",
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
    );
  }

  if (this.isModified("phone") && !phoneRegex.test(this.phone)) {
    this.invalidate("phone", "Phone number must be valid.");
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      return next(new Error("Password must meet complexity requirements."));
    }

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema);
