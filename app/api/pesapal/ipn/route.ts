import { NextResponse } from "next/server";
import axios from "axios";
import { getPesapalToken } from "@/lib/pesapal";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("IPN RECEIVED:", body);

    const { orderTrackingId, orderMerchantReference } = body;

    if (!orderTrackingId) {
      return NextResponse.json(
        { error: "Missing orderTrackingId" },
        { status: 400 }
      );
    }

    // 1️⃣ Get Pesapal Token
    const token = await getPesapalToken();

    // 2️⃣ Verify transaction status from Pesapal
    const statusResponse = await axios.get(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
      {
        params: { orderTrackingId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("VERIFICATION RESPONSE:", statusResponse.data);

    const paymentStatus = statusResponse.data.payment_status_description;

    // 3️⃣ Only upgrade if COMPLETED
    if (paymentStatus === "Completed") {
      await connectDB();

      // Your merchant reference format: ORDER-123 or include email
      // Adjust based on how you store references
      const user = await User.findOne({
        // Example: if you stored email in reference
        // email: orderMerchantReference
      });

      if (user) {
        user.role = "vip";

        // 30 days subscription example
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        user.subscriptionExpiresAt = expiry;

        await user.save();

        console.log("USER UPGRADED TO VIP");
      }
    }

    return NextResponse.json({ status: "IPN processed" });

  } catch (error: any) {
    console.error("IPN ERROR:", error.response?.data || error);
    return NextResponse.json(
      { error: "IPN processing failed" },
      { status: 500 }
    );
  }
}