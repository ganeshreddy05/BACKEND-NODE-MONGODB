import mongoose from "mongoose";

// Mongoose schema
const summarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  summaryContent: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = { Summary, summaryValidationSchema };