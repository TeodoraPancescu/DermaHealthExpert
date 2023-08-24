const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
   
});

const Disease = mongoose.model('disease', diseaseSchema);

module.exports = Disease;