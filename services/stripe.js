import { API } from "../constants";

export const fetchPaymentSheetParams = async (paymentDetails) => {
 
  const response = await API.post("/api/checkout", paymentDetails);
  
  return response.data;
};
