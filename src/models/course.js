import mongoose from "mongoose";

// Mongoose schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = { Course, courseValidationSchema };