export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      amount,
      expire_by,
      reference_id,
      username,
      password,
      name,
      contact,
      email
    } = req.body;

    // Basic validation
    if (!amount || !expire_by || !reference_id || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters"
      });
    }

    // Encode Basic Auth
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // Razorpay Payload
    const payload = {
      amount: amount,
      currency: "INR",
      accept_partial: false,
      first_min_partial_amount: 0,
      expire_by: expire_by,
      reference_id: reference_id,
      description: "Payment for policy no #23456",
      customer: {
        name: name || "Test User",
        contact: contact || "+919999999999",
        email: email || "test@example.com"
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      notes: {
        policy_name: "Life Insurance Policy"
      },
      callback_url: "https://example-callback-url.com/",
      callback_method: "get"
    };

    // Call Razorpay API
    const response = await fetch("https://api.razorpay.com/v1/payment_links/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      razorpay_response: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
