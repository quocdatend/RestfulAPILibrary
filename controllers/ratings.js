const Rating = require('../schemas/ratings');

exports.addRating = async (req, res) => {
  try {
    const { userId, documentId, rating, review } = req.body;

    const newRating = new Rating({
      userId,
      documentId,
      rating,
      review,
    });

    const savedRating = await newRating.save();
    res.status(201).json({ message: 'Rating added successfully', rating: savedRating });
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const { documentId } = req.query;
    if (!documentId) {
      return res.status(400).json({ message: "DocumentId is required" });
    }

    const ratings = await Rating.find({ documentId });  

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this document' });
    }

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRating = await Rating.findByIdAndDelete(id);  // Xóa đánh giá theo id
    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rating', error });
  }
};
