import axios from "axios";
import { BASE_URL } from "../config.js";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});
