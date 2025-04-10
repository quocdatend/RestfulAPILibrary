const mongoose = require('mongoose');

const Document = require('../schemas/document');
const Category = require('../schemas/category');
const Subject = require('../schemas/Subject');
const User = require('../schemas/user');


exports.createDocument = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            category_id,
            user_id,
            file_url,
            file_size,
            file_type,
            tags,
            status
        } = req.body;

        if (!title || !subject || !category_id || !user_id || !file_url || !file_size || !file_type) {
            return res.status(400).json({
                message: 'Missing required fields: title, subject, category_id, user_id, file_url, file_size, file_type'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(subject)) {
            return res.status(400).json({ message: 'Invalid subject ID' });
        }

        const document = new Document({
            title,
            description: description || '',
            subject,
            category_id,
            user_id,
            file_url,
            file_size,
            file_type,
            tags: tags || [],
            status: status || 'public'
        });

        await document.save();

        res.status(201).json({
            message: 'Document created successfully',
            document
        });
    } catch (error) {
        console.error('Create error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ isDeleted: false })
            .populate('subject', 'name')
            .populate('category_id', 'name');

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 Get Document By ID
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        .populate('category_id', 'name description');

        if (!document || document.isDeleted) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        console.error('Fetch by ID error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 Update Document
exports.updateDocument = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            category_id,
            user_id,
            file_url,
            file_size,
            file_type,
            tags,
            status
        } = req.body;

        const document = await Document.findById(req.params.id);
        if (!document || document.isDeleted) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (subject && !mongoose.Types.ObjectId.isValid(subject)) {
            return res.status(400).json({ message: 'Invalid subject ID' });
        }

        document.title = title || document.title;
        document.description = description || document.description;
        document.subject = subject || document.subject;
        document.category_id = category_id || document.category_id;
        document.user_id = user_id || document.user_id;
        document.file_url = file_url || document.file_url;
        document.file_size = file_size || document.file_size;
        document.file_type = file_type || document.file_type;
        document.tags = tags || document.tags;
        document.status = status || document.status;

        await document.save();

        res.status(200).json({ message: 'Document updated successfully', document });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};

// 🟢 Soft Delete Document
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted', document });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};
exports.getDocumentsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;

        const documents = await Document.find({ 
                category_id, 
                isDeleted: false 
            })
            .populate('category_id', 'name description')
            .populate('education_level', 'name subjects');

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        console.error('Lỗi khi lấy tài liệu theo thể loại:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
