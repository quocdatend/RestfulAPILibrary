const mongoose = require('mongoose');

const educationLevelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['grade2', 'grade3', 'university', 'none']
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('EducationLevel', educationLevelSchema);
