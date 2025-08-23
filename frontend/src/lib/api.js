// lib/api.ts
import axiosInstance from "../utils/axiosInstance";

export async function apiRequest(method, url, data) {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;

  const res = await axiosInstance.request({
    method,
    url,
    data,
    headers: !isFormData && data ? { "Content-Type": "application/json" } : {},
  });

  return res.data;
}
