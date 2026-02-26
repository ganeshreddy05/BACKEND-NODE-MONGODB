import mongoose from "mongoose";

// Mongoose schema
const notesSchema = new mongoose.Schema({
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
  notesContent: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = { Notes, notesValidationSchema };