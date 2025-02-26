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
    `/api/users/user/${id}`,
    {  },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
