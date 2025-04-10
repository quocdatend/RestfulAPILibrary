const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payments');
var { check_authentication, check_authorization } = require("../utils/check_auth");

// Public routes
router.get('/paypal/success', PaymentController.handlePaypalSuccess);
router.get('/paypal/cancel', PaymentController.handlePaypalCancel);
router.post('/paypal/webhook', PaymentController.handlePaypalWebhook);

// Protected routes
router.post('/create',check_authentication, check_authorization('user'), PaymentController.createPayment);
router.get('/', PaymentController.getAllPayments);
router.get('/:id', PaymentController.getPaymentById);
router.get('/user/:userId', PaymentController.getPaymentsByUser);
router.put('/:id', PaymentController.updatePayment);

module.exports = router;