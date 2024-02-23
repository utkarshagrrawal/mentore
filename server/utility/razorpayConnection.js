const razorpay = require('razorpay');
require('dotenv').config();

const razorpayConnection = new razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

module.exports = {
    razorpayConnection
}
