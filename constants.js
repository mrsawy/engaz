import axios from "axios";
export const API_URI = "https://enjaz.pub.sa";
export const API = axios.create({
  baseURL: API_URI,
});
export const STRIPE_PUBLIC_KEY =
  "pk_live_51KcvtSKjq4U7y3Gg4W6lnCfeRRiMNxnsnovEBYtgCcpt0lJCwMTRTg35JT69RQhfNGA7FLsNRlyDKPx8Rb4kckp400hNNbrSTL";
