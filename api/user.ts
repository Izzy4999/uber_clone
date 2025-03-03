import { client } from "./client";

export const createUser = async (data: { clerk_id: string; email: string }) => {
  const response = await client.post("/api/users", data);
  //   console.log(response)
  return response.data;
};

export const updateUserProfile = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  const response = await client.put(
    `/api/users/user/me`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const becomeDriver = async ({
  token,
  ...rest
}: {
  token: string;
  carMake: string;
  carModel: string;
  carYear: string;
  plate: string;
  carColor: string;
  carSeats: string;
  carImage: string;
}) => {
  const response = await client.put(
    "/api/users/user/driver",
    { ...rest },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
