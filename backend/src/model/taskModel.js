const mongoose = require("mongoose");

const tasKSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})



module.exports = mongoose.model("Task", tasKSchema);