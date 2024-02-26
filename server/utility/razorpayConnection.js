const razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const razorpayOrderCreate = async () => {
    const order = await razorpayInstance.orders.create({
        amount: 15000,
        currency: "INR",
        receipt: uuidv4(),
    })
    return order;
}

module.exports = {
    razorpayOrderCreate
}
