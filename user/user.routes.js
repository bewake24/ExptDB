import { Router } from "express";
import User from "./user.model.js";
import { MONGOOSE_DUPLICATE_KEY, MONGOOSE_VALIDATION_ERROR } from "./user.constant.js";

const router = Router();

router.post("/adduser", async (req, res) => {
    try {
        const { username, email } = req.body;
        // Create the user here directly, Mongoose will throw error if duplicate entries found
        const user = await User.create({ username, email });
        res.status(200).json({ message: "User added successfully...", data: user });
    
      } catch (err) {
        if(err.code === MONGOOSE_DUPLICATE_KEY) {
            return res.status(400).json({ message: "User already exists..." });
        }
    
        if(err.name === MONGOOSE_VALIDATION_ERROR) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: err });
      }
});

export default router;