const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    educationLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EducationLevel',
        required: true
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
