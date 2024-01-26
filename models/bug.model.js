const mongoose = require("mongoose");

const bugSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
        match: /^https?:\/\/.+/ // Basic URL format validation
    },
    severity: {
        type: String,
        enum: ['Critical', 'Major', 'Medium', 'Low'],
        required: true
    },
    raised_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const BugModel = mongoose.model("bugs", bugSchema);

module.exports = {
    BugModel
};
