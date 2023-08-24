const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      services: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'services',
        },
      ],
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
      },
    },
    { strictPopulate: false } // Add the strictPopulate option here
  );
  

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;