import axiosClient from "../axiosClient";
export  async function createOrder(data) {
  const response = await axiosClient.post(`/create-order`, data);
  return response.data;
}

export  async function verifyPayment(data) {
  const response = await axiosClient.post(`/verify-payment`, data);
  return response.data;
}

