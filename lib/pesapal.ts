import axios from "axios";

export async function getPesapalToken() {
  const response = await axios.post(
    `${process.env.PESAPAL_BASE_URL}/api/Auth/RequestToken`,
    {
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }
  );

  return response.data.token;
}