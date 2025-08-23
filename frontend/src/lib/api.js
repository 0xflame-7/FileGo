// lib/api.ts
import axiosInstance from "../utils/axiosInstance";

export async function apiRequest(method, url, data) {
  const res = await axiosInstance.request({
    method,
    url,
    data,
    headers: data ? { "Content-Type": "application/json" } : {},
  });
  return res.data; // already parsed
}
