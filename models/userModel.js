const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nume: {
      type: String,
      required: true,
    },
    prenume: {
      type: String,
      required: true,
    },
    CNP: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    parola: {
      type: String,
      required: true,
    },
    esteDoctor: {
      type: Boolean,
      default: false,
    },
    esteAdmin: {
      type: Boolean,
      default: false,
    },
    seenNot: {
      type: Array,
      default: []
    },
    unseenNot: {
      type: Array,
      default: []
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
  }],
  }, {
  timestamps: true
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
