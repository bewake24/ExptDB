import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.config.js";
import userRoutes from "./user/user.routes.js";

const app = express();

connectDB();

const PORT = process.env.PORT || 6202;
console.log(process.env.TEST);

app.use(express.urlencoded({ extended: false })); // Body: x-www-form-urlencoded
app.use(express.json()); // Body: raw

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});


app.use("/user", userRoutes);

// app.post("/user/adduser", async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     // Create the user, Mongoose will throw error if duplicate
//     const user = await User.create({ username, email });
//     res.status(200).json({ message: "User added successfully...", data: user });

//   } catch (err) {
//     if(err.code === MONGOOSE_DUPLICATE_KEY) {
//         return res.status(400).json({ message: "User already exists..." });
//     }

//     if(err.name === MONGOOSE_VALIDATION_ERROR) {
//         return res.status(400).json({ message: err.message });
//     }
//     return res.status(500).json({ message: err });
//   }
// });

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("Backend server is running... ");
    if (typeof PORT === "number") {
      console.log("Open this link in your browser: http://localhost:" + PORT);
    } else {
      console.log("Open this link in your browser:" + PORT);
    }
  });
});
