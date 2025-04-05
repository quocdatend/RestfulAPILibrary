const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category_id: {  
        type: mongoose.Types.ObjectId,
        ref: 'Category',  
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    rating_avg: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
