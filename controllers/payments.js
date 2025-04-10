const PaymentService = require('../services/payments');

class PaymentController {
  // Create a new payment
  async createPayment(req, res) {
    try {
      const { order_id, payment_amount, currency, payment_method } = req.body;
      const user_id = req.user.id; // Assuming user ID comes from auth middleware
      
      // Validate required fields
      if (!order_id || !payment_amount || !currency) {
        return res.status(400).json({ message: 'Missing required payment information' });
      }
      
      const paymentData = {
        user_id,
        order_id,
        payment_amount,
        currency,
        payment_method: payment_method || 'paypal'
      };
      
      const result = await PaymentService.createPayPalPayment(paymentData);
      
      return res.status(200).json({
        message: 'Payment initiated successfully',
        approvalUrl: result.approvalUrl,
        paymentId: result.paymentId
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      return res.status(500).json({ message: 'Failed to create payment', error: error.message });
    }
  }

  // Handle PayPal success callback
  async handlePaypalSuccess(req, res) {
    try {
      const { paymentId, PayerID } = req.query;
      
      if (!paymentId || !PayerID) {
        return res.status(400).json({ message: 'Missing PayPal payment information' });
      }
      
      const result = await PaymentService.executePayPalPayment(paymentId, PayerID);
      
      // Redirect to client success page with transaction info
      return res.redirect(`${process.env.CLIENT_URL}/payment/success?transactionId=${result.transaction_id}`);
    } catch (error) {
      console.error('PayPal success callback error:', error);
      return res.redirect(`${process.env.CLIENT_URL}/payment/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  // Handle PayPal cancel callback
  handlePaypalCancel(req, res) {
    return res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
  }

  // Handle PayPal webhook events
  async handlePaypalWebhook(req, res) {
    try {
      const webhookData = req.body;
      
      // Verify webhook signature (implementation depends on PayPal SDK)
      const result = await PaymentService.processPayPalWebhook(webhookData);
      
      return res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      console.error('PayPal webhook error:', error);
      return res.status(500).json({ message: 'Failed to process webhook', error: error.message });
    }
  }

  // Get all payments (admin only)
  async getAllPayments(req, res) {
    try {
      // Check admin permission here if needed
      const payments = await PaymentService.getAllPayments();
      return res.status(200).json(payments);
    } catch (error) {
      console.error('Get all payments error:', error);
      return res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Check if user is authorized to view this payment
      if (payment.user_id !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this payment' });
      }
      
      return res.status(200).json(payment);
    } catch (error) {
      console.error('Get payment by ID error:', error);
      return res.status(500).json({ message: 'Failed to retrieve payment', error: error.message });
    }
  }

  // Get payments by user ID
  async getPaymentsByUser(req, res) {
    try {
      const { userId } = req.params;
      
      // Check if user is authorized to view these payments
      if (userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view these payments' });
      }
      
      const payments = await PaymentService.getPaymentsByUser(userId);
      return res.status(200).json(payments);
    } catch (error) {
      console.error('Get payments by user error:', error);
      return res.status(500).json({ message: 'Failed to retrieve payments', error: error.message });
    }
  }

  // Update payment
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Prevent updating critical fields
      delete updates.user_id;
      delete updates.transaction_id;
      delete updates.created_at;
      
      updates.updated_at = new Date();
      
      const payment = await PaymentService.getPaymentById(id);
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Check if user is authorized to update this payment
      if (payment.user_id !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this payment' });
      }
      
      const updatedPayment = await PaymentService.updatePayment(id, updates);
      return res.status(200).json(updatedPayment);
    } catch (error) {
      console.error('Update payment error:', error);
      return res.status(500).json({ message: 'Failed to update payment', error: error.message });
    }
  }
}

module.exports = new PaymentController();