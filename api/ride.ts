import { client } from "./client";

export const createRide = async ({
  token,
  ...rest
}: {
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: string; // Assuming ISO string or timestamp
  fare_price: string;
  payment_status: string; // Adjust based on possible values
  driver_id: string;
  user_id: string;
  token: string; //
}) => {
  const response = await client.post(
    "/api/rides",
    { ...rest },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data
};
