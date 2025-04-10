const Payment = require('../schemas/payment');
const paypal = require('@paypal/checkout-server-sdk');
const { v4: uuidv4 } = require('uuid');

// PayPal client configuration
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  
  return new paypal.core.PayPalHttpClient(environment);
}

class PaymentService {
  // Create a PayPal payment
  async createPayPalPayment(paymentData) {
    try {
      const client = getPayPalClient();
      const request = new paypal.orders.OrdersCreateRequest();
      
      // Convert Decimal128 to string for PayPal
      const amount = paymentData.payment_amount.toString();
      
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: paymentData.currency,
            value: amount
          },
          reference_id: paymentData.order_id
        }],
        application_context: {
          return_url: `${process.env.API_URL}/payments/paypal/success`,
          cancel_url: `${process.env.API_URL}/payments/paypal/cancel`
        }
      });
      
      const response = await client.execute(request);
      const paymentId = response.result.id;
      
      // Find approval URL
      let approvalUrl = '';
      for (const link of response.result.links) {
        if (link.rel === 'approve') {
          approvalUrl = link.href;
          break;
        }
      }
      
      // Create payment record with pending status
      await Payment.create({
        user_id: paymentData.user_id,
        order_id: paymentData.order_id,
        transaction_id: paymentId,
        payment_amount: paymentData.payment_amount,
        currency: paymentData.currency,
        payment_status: 'PENDING',
        payment_method: 'paypal',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      return { paymentId, approvalUrl };
    } catch (error) {
      console.error('Create PayPal payment error:', error);
      throw new Error(`Failed to create PayPal payment: ${error.message}`);
    }
  }

  // Execute PayPal payment after user approval
  async executePayPalPayment(paymentId, PayerID) {
    try {
      const client = getPayPalClient();
      const request = new paypal.orders.OrdersCaptureRequest(paymentId);
      request.requestBody({});
      
      const response = await client.execute(request);
      const transactionId = response.result.purchase_units[0].payments.captures[0].id;
      const status = response.result.status;
      
      // Update payment record
      const payment = await Payment.findOne({ transaction_id: paymentId });
      
      if (!payment) {
        throw new Error('Payment record not found');
      }
      
      payment.payment_status = status;
      payment.transaction_id = transactionId;
      payment.updated_at = new Date();
      await payment.save();
      
      return payment;
    } catch (error) {
      console.error('Execute PayPal payment error:', error);
      throw new Error(`Failed to execute PayPal payment: ${error.message}`);
    }
  }

  // Process PayPal webhook events
  async processPayPalWebhook(webhookData) {
    try {
      // Verify webhook signature here (implementation depends on PayPal SDK)
      
      const eventType = webhookData.event_type;
      const resource = webhookData.resource;
      
      switch (eventType) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          await this.handlePaymentCompleted(resource);
          break;
        case 'PAYMENT.CAPTURE.DENIED':
          await this.handlePaymentDenied(resource);
          break;
        case 'PAYMENT.CAPTURE.REFUNDED':
          await this.handlePaymentRefunded(resource);
          break;
        // Add more event types as needed
      }
      
      return { success: true, eventType };
    } catch (error) {
      console.error('Process PayPal webhook error:', error);
      throw new Error(`Failed to process PayPal webhook: ${error.message}`);
    }
  }

  // Handle payment completed webhook event
  async handlePaymentCompleted(resource) {
    try {
      const payment = await Payment.findOne({ transaction_id: resource.id });
      
      if (!payment) {
        throw new Error('Payment record not found');
      }
      
      payment.payment_status = 'COMPLETED';
      payment.updated_at = new Date();
      await payment.save();
      
      // Additional business logic can be added here
      // e.g., update order status, send confirmation email, etc.
      
      return payment;
    } catch (error) {
      console.error('Handle payment completed error:', error);
      throw error;
    }
  }

  // Handle payment denied webhook event
  async handlePaymentDenied(resource) {
    try {
      const payment = await Payment.findOne({ transaction_id: resource.id });
      
      if (!payment) {
        throw new Error('Payment record not found');
      }
      
      payment.payment_status = 'DENIED';
      payment.updated_at = new Date();
      await payment.save();
      
      // Additional business logic can be added here
      
      return payment;
    } catch (error) {
      console.error('Handle payment denied error:', error);
      throw error;
    }
  }

  // Handle payment refunded webhook event
  async handlePaymentRefunded(resource) {
    try {
      const payment = await Payment.findOne({ transaction_id: resource.id });
      
      if (!payment) {
        throw new Error('Payment record not found');
      }
      
      payment.payment_status = 'REFUNDED';
      payment.updated_at = new Date();
      await payment.save();
      
      // Additional business logic can be added here
      
      return payment;
    } catch (error) {
      console.error('Handle payment refunded error:', error);
      throw error;
    }
  }

  // Get all payments
  async getAllPayments() {
    try {
      return await Payment.find().sort({ created_at: -1 });
    } catch (error) {
      console.error('Get all payments error:', error);
      throw new Error(`Failed to retrieve payments: ${error.message}`);
    }
  }

  // Get payment by ID
  async getPaymentById(id) {
    try {
      return await Payment.findById(id);
    } catch (error) {
      console.error('Get payment by ID error:', error);
      throw new Error(`Failed to retrieve payment: ${error.message}`);
    }
  }

  // Get payments by user ID
  async getPaymentsByUser(userId) {
    try {
      return await Payment.find({ user_id: userId }).sort({ created_at: -1 });
    } catch (error) {
      console.error('Get payments by user error:', error);
      throw new Error(`Failed to retrieve payments: ${error.message}`);
    }
  }

  // Update payment
  async updatePayment(id, updates) {
    try {
      return await Payment.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Update payment error:', error);
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();