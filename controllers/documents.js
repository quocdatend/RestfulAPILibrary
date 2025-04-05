const Document = require('../schemas/document');
// 🟢 Tạo mới document
exports.createDocument = async (req, res) => {
    try {
        const { title, category_id, user_id, file_url } = req.body;  // Thay subject_id thành category_id

        if (!title || !category_id || !user_id || !file_url) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const document = new Document({ title, category_id, user_id, file_url });  // Thay subject_id thành category_id
        await document.save();

        res.status(201).json({ message: 'Tài liệu được tạo thành công', document });
    } catch (error) {
        console.error('Lỗi khi tạo tài liệu:', error);
        res.status(500).json({ error: 'Lỗi server', message: error.message });
    }
};

// 🟢 Lấy tất cả documents (chỉ lấy tài liệu chưa bị xóa)
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ isDeleted: false })
            .populate('category_id', 'name description');  // Lấy thông tin user

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tài liệu:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 Lấy tài liệu theo ID
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate('category_id', 'name description');

        if (!document || document.isDeleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu' });
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        console.error('Lỗi khi lấy tài liệu:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 Cập nhật document
exports.updateDocument = async (req, res) => {
    try {
        const { title, category_id, user_id, file_url } = req.body;  // Thay subject_id thành category_id

        const document = await Document.findById(req.params.id);
        if (!document || document.isDeleted) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        document.title = title || document.title;
        document.category_id = category_id || document.category_id;  // Thay subject_id thành category_id
        document.user_id = user_id || document.user_id;
        document.file_url = file_url || document.file_url;

        await document.save();

        res.status(200).json({ message: 'Cập nhật thành công', document });
    } catch (error) {
        console.error('Lỗi khi cập nhật tài liệu:', error);
        res.status(500).json({ error: 'Lỗi server', message: error.message });
    }
};

// 🟢 Xóa document (cập nhật `isDeleted = true`)
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        res.status(200).json({ message: 'Tài liệu đã được xóa', document });
    } catch (error) {
        console.error('Lỗi khi xóa tài liệu:', error);
        res.status(500).json({ error: 'Lỗi server', message: error.message });
    }
};
