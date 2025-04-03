const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documents');

// 🟢 Tạo mới tài liệu
router.post('/', documentController.createDocument);

// 🟢 Lấy danh sách tất cả tài liệu (chưa bị xóa)
router.get('/', documentController.getAllDocuments);

// 🟢 Lấy tài liệu theo ID
router.get('/:id', documentController.getDocumentById);

// 🟢 Cập nhật tài liệu
router.put('/:id', documentController.updateDocument);

// 🟢 Xóa tài liệu (soft delete)
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
