const Razorpay = require('razorpay');
const Order = require('../model/orders');
const { json } = require('body-parser');
const purchasepremium = async (req, res, next) => {
    try {
      const rzp = new Razorpay({
        key_id: process.env.Razorpay_KEY_ID,
        key_secret: process.env.Razorpay_KEY_SECRET,
      });
  
      const amount = 2500;
  
      rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
  
        try {
          const createdOrder = await req.user.createOrder({
            orderid: order.id,
            status: 'PENDING',
          });
  
          res.status(200).json({ order, key_id: rzp.key_id });
        } catch (error) {
          throw new Error(error);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(403).json({ message: 'Something went wrong', error: error.message });
    }
  };
  