export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const {
      amount,
      expire_by,
      reference_id,
      name,
      contact,
      email
    } = req.body;

    // 🔹 Basic validation
    if (!amount || !expire_by || !reference_id || !name || !contact) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 🔹 Razorpay Auth
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_SECRET}`
    ).toString("base64");

    // 🔹 Final Payload (as per your requirement)
    const payload = {
      amount: Number(amount),
      currency: "INR",
      accept_partial: false,
      expire_by: Number(expire_by),
      reference_id: String(reference_id),
      description: `Payment for policy no #${reference_id}`,
      customer: {
        name: name,
        contact: contact,
        email: email || ""
      },
      notify: {
        sms: false,   // you control via bot
        email: false
      },
      reminder_enable: false,
      notes: {
        policy_name: "Life Insurance Policy"
      },
      callback_url: "https://yourdomain.com/callback", // update later
      callback_method: "get"
    };

    // 🔹 Razorpay API Call
    const response = await fetch(
      "https://api.razorpay.com/v1/payment_links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // 🔹 Handle Razorpay error
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data
      });
    }

    // 🔹 Success response (clean)
    return res.status(200).json({
      success: true,
      payment_link: data.short_url,
      payment_id: data.id,
      status: data.status,
      raw: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}
