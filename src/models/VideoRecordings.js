import mongoose from "mongoose";

// Mongoose schema
const videoRecordingSchema = new mongoose.Schema({
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
  videoURL: {
    type: String,
    required: true,
    trim: true
  },
  transcriptURL: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


const VideoRecording = mongoose.model('VideoRecording', videoRecordingSchema);

module.exports = { VideoRecording, videoRecordingValidationSchema };