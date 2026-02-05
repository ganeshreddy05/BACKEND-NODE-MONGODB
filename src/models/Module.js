import mongoose from "mongoose";

// Mongoose schema
const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = { Module, moduleValidationSchema };