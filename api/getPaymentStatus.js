module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST allowed"
    });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Payment Link ID (id) is required"
      });
    }

    // 🔐 Auth from ENV
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_SECRET}`
    ).toString("base64");

    // ✅ Correct API (as per Razorpay docs)
    const response = await fetch(
      `https://api.razorpay.com/v1/payment_links/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    // 🔍 Extract payment info
    const payment = data.payments && data.payments.length > 0
      ? data.payments[0]
      : null;

    if (!payment) {
      return res.status(200).json({
        success: true,
        message: "Payment not completed yet",
        status: data.status
      });
    }

    // 🕒 Convert timestamp
    const dateObj = new Date(payment.created_at * 1000);

    const date = dateObj.toLocaleDateString("en-IN");
    const time = dateObj.toLocaleTimeString("en-IN");

    // ✅ Final response (as per your requirement)
    return res.status(200).json({
      success: true,
      order_id: data.order_id,
      amount: payment.amount,
      date: date,
      time: time,
      method: payment.method,
      payment_id: payment.payment_id,
      status: payment.status
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
