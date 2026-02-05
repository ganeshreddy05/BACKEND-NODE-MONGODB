import mongoose from "mongoose";

// Mongoose schema
const lessonMaterialSchema = new mongoose.Schema({
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
  materialURL: {
    type: String,
    required: true,
    trim: true
  },
  materialType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'txt', 'ppt']
  }
}, {
  timestamps: true
});

const LessonMaterial = mongoose.model('LessonMaterial', lessonMaterialSchema);

module.exports = { LessonMaterial, lessonMaterialValidationSchema };