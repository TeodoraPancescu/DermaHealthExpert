const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        imagineDoctor: {
            type: String,
            required: true,
        },
        numeDoctor: {
            type: String,
            required: true,
        },
        prenumeDoctor: {
            type: String,
            required: true,
        },
        emailDoctor: {
            type: String,
            required: true,
        },
        numarTelefon: {
            type: String,
            required: true,
        },
        serviciiOferite: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
        },
        experienta: {
            type: String,
            required: true,
        },
        pretServiciu: {
            type: Number,
            required: true,
        },
        oreLucru: {
            type: Array,
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'reviews',
            },
        ],
        cvDoctor: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;
