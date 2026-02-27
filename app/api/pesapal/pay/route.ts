import { NextResponse } from "next/server";
import axios from "axios";
import { getPesapalToken } from "@/lib/pesapal";

export async function POST(req: Request) {
  try {
    const { email, amount } = await req.json();

    const token = await getPesapalToken();

    const orderData = {
      id: `ORDER-${Date.now()}`,
      currency: "KES",
      amount: amount,
      description: "VIP Subscription",
      callback_url: "http://localhost:3000/payment-success",
      notification_id: "YOUR_IPN_ID",
      billing_address: {
        email_address: email,
        first_name: "Customer",
        last_name: "User",
      },
    };

    const response = await axios.post(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );


console.log("PESAPAL RESPONSE:", response.data);
return NextResponse.json(response.data);



    // return NextResponse.json({
    //   redirect_url: response.data.redirect_url,
    // });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Payment failed" },
      { status: 500 }
    );
  }
}