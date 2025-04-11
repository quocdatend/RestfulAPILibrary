const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documents');
let { check_authentication, check_authorization, check_authenticationAdmin, check_authorizationAdmin } = require("../utils/check_auth");
let constants = require('../utils/constants')

router.post('/', check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), documentController.createDocument);

// Get all documents
router.get('/', documentController.getAllDocuments);

// Get a document by ID
router.get('/:id', documentController.getDocumentById);

// Update a document by ID
router.put('/:id', check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), documentController.updateDocument);

// Soft delete a document by ID
router.delete('/:id', check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), documentController.deleteDocument);

router.get('/category/:category_id', documentController.getDocumentsByCategory);

module.exports = router;
