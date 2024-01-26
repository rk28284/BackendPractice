const express = require("express");
const { BugModel } = require("../models/bug.model");
const { auth } = require("../middleware/auth.middleware");

const bugRouter = express.Router();
bugRouter.use(auth);

bugRouter.get("/", async (req, res) => {
    try {
        const bugs = await BugModel.find({ raised_by: req.user._id });
        res.send(bugs);
    } catch (err) {
        res.json({ error: err.message });
    }
});

bugRouter.post("/add", async (req, res) => {
    try {
        const bug = new BugModel({
            title: req.body.title,
            description: req.body.description,
            source: req.body.source,
            severity: req.body.severity,
            raised_by: req.user._id,
        });

        await bug.save();
        res.status(200).json({ msg: "New Bug added", bug: req.body });
    } catch (err) {
        res.json({ error: err.message });
    }
});

bugRouter.patch("/update/:id", async (req, res) => {
    const userID = req.user._id;
    const { id } = req.params;

    try {
        const bug = await BugModel.findOne({ _id: id, raised_by: userID });

        if (bug) {
            await BugModel.findByIdAndUpdate(id, req.body);
            res.status(200).json({ msg: `${bug.title} has been updated` });
        } else {
            res.json({ msg: "Not Authorized" });
        }
    } catch (err) {
        res.json({ error: err.message });
    }
});

bugRouter.delete("/delete/:id", async (req, res) => {
    const userID = req.user._id;
    const { id } = req.params;

    try {
        const bug = await BugModel.findOne({ _id: id, raised_by: userID });

        if (bug) {
            await BugModel.findByIdAndDelete(id);
            res.status(200).json({ msg: `${bug.title} has been deleted` });
        } else {
            res.json({ msg: "Not Authorized" });
        }
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = {
    bugRouter,
};
