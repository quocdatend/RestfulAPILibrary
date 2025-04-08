const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    education_level: {
        type: String,
        enum: ['grade2', 'grade3', 'university', 'none'], // Thêm 'none' cho trường hợp không thuộc cấp nào
        default: 'none' // Mặc định là không thuộc cấp học nào
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
    file_size: {
        type: Number,
        required: true
    },
    file_type: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    rating_avg: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    download_count: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['public', 'private', 'pending'],
        default: 'public'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);