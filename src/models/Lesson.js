import mongoose from "mongoose";

// Mongoose schema
const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = { Lesson, lessonValidationSchema };