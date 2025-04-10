const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documents');

router.post('/', documentController.createDocument);

// Get all documents
router.get('/', documentController.getAllDocuments);

// Get a document by ID
router.get('/:id', documentController.getDocumentById);

// Update a document by ID
router.put('/:id', documentController.updateDocument);

// Soft delete a document by ID
router.delete('/:id', documentController.deleteDocument);

router.get('/category/:category_id', documentController.getDocumentsByCategory);

module.exports = router;
