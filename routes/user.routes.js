const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, avatar, email, password } = req.body;
    try {
        let userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(200).json({ msg: "User already exists, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const user = new UserModel({
            name,
            avatar,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(200).json({ msg: "New user registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({ userID: user._id, user: user.name }, process.env.SECRET_KEY);
                res.status(200).json({ msg: "Logged In!", token });
            } else {
                res.status(200).json({ msg: "Wrong Credentials" });
            }
        } else {
            res.json({ msg: "User does not exist" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    userRouter,
};
