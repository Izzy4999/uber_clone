// import { useGlobalState } from "@/hooks/globalState";
import axios, { AxiosError } from "axios";
// import { redirect } from "react-router-dom";
import CryptoJS from "crypto-js";

// const BASE_URL = import.meta.env.VITE_PROD_API;

// console.log(process.env.PROD_API)
// console.log(import.meta.env.VITE_PROD_API);
// console.log(import.meta.env.VITE_LOCAL_API);
// console.log(import.meta.env.VITE_KEY);

console.log(process.env.SECRET_KEY);

// Decryption function
async function decryptData(encryptedData: string, iv: string) {
  try {
    // Decode the key and IV from base64
    const decodedKey = CryptoJS.enc.Base64.parse(process.env.SECRET_KEY!);
    const decodedIv = CryptoJS.enc.Base64.parse(iv);

    // Decrypt the data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, decodedKey, {
      iv: decodedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert the decrypted bytes to a string and parse it as JSON
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}

const axiosInstance = axios.create({
  baseURL: "http://192.168.88.52:6000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.response.use(async (response) => {
//   return response?.data?.iv
//     ? {
//         ...response,
//         data: await decryptData(
//           response.data?.encryptedData,
//           response.data?.iv
//         ),
//       }
//     : response;
// });

const withInterceptorInsance = axios.create({
  baseURL: "http://192.168.88.52:6000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

withInterceptorInsance.interceptors.request.use(
  function (config) {
    // const token = useGlobalState.getState().accesss_token;

    // if (token) {
    //   config.headers.Authorization = "Bearer " + token;
    // }

    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

// withInterceptorInsance.interceptors.response.use(
//   async (response) => {
//     // const decryptedData =
//     return response?.data?.iv
//       ? {
//           ...response,
//           data: await decryptData(
//             response.data?.encryptedData,
//             response.data?.iv
//           ),
//         }
//       : response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is a 401 and the original request has not already been retried
//     if (error?.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = useGlobalState.getState().refresh_token;
//         if (refreshToken) {
//           const response = await axios.get(`${BASE_URL}/auth/refresh-token`, {
//             headers: {
//               refresh_token: refreshToken,
//             },
//           });

//           if (response?.status === 200) {
//             const { accessToken, refreshToken: newRefreshToken } = response
//               ?.data?.iv
//               ? await decryptData(
//                   response.data?.encryptedData,
//                   response.data?.iv
//                 )
//               : response.data;
//             useGlobalState.setState({
//               accesss_token: accessToken,
//               refresh_token: newRefreshToken,
//             });

//             originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//             return axiosInstance(originalRequest);
//           }
//         }
//       } catch (err) {
//         const error = err as AxiosError;

//         if (error.response?.status === 400) {
//           const logout = useGlobalState.getState().clearUserData;
//           logout();
//           return redirect("/login");
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

const client = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
};

const clientInteceptor = {
  get: withInterceptorInsance.get,
  post: withInterceptorInsance.post,
  put: withInterceptorInsance.put,
  delete: withInterceptorInsance.delete,
  patch: withInterceptorInsance.patch,
};

export { client, clientInteceptor };
