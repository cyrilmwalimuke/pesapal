import { NextResponse } from "next/server";
import axios from "axios";
import { getPesapalToken } from "@/lib/pesapal";


export async function POST(req: Request) {
  try {


    const token = await getPesapalToken();

    // 2️⃣ Verify transaction status from Pesapal
    const response = await axios.post(
        `${process.env.PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          url: "https://pesapal-rho.vercel.app/api/pesapal/ipn",
          ipn_notification_type: "POST"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(response.data);



    return NextResponse.json({ status: "IPN processed" });

  } catch (error: any) {
    console.error("IPN ERROR:", error.response?.data || error);
    return NextResponse.json(
      { error: "IPN processing failed" },
      { status: 500 }
    );
  }
}