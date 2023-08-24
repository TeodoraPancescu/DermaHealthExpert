const mongoose = require('mongoose')
const appointmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorInfo: {
        type: Object,
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    ora: {
        type: String,
        required: true
    },
    status: {
        type: Object,
        required: true,
        default: { doctorInfo: "pending" }
    },
    transactionId: {
        type: String,
        require: true,
    },
},
    {
        timestamps: true
    })

const appointmentModel = mongoose.model("appointments", appointmentSchema)
module.exports = appointmentModel;