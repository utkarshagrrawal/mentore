const { payLogic, paymentSuccessLogic } = require("../logic/payment.logic");

const pay = async (req, res, next) => {
  const response = await payLogic(req.params);

  if (response.error) {
    return res.json({ error: response.error });
  }

  req.body.meeting_uuid = response.success;

  next();
};

const paymentSuccess = async (req, res, next) => {
  const response = await paymentSuccessLogic(req.params);

  if (response.error) {
    return res.json({ error: response.error });
  }

  next();
};

module.exports = {
  pay,
  paymentSuccess,
};
