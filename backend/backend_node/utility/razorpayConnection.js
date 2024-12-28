const razorpay = require("razorpay");

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const razorpayOrderCreate = async (amount) => {
  let receiptId = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 12; i++) {
    receiptId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  const order = await razorpayInstance.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: receiptId + "_" + Date.now(),
  });
  return order;
};

module.exports = {
  razorpayOrderCreate,
};
