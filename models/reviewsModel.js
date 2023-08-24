const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    ratingNumber:{
        type: Number,
    }
   
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;