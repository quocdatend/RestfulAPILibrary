let mongoose = require("mongoose");

let ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    documentId: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('rating', ratingSchema);
