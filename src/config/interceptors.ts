import { getAccessToken } from "@/services/authToken";
import axios, { type CreateAxiosDefaults } from "axios";

const options: CreateAxiosDefaults = {
  baseURL: 'https://feo.wellsoft.uz/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}
const axiosClassic = axios.create(options);
const axiosWithAuth = axios.create(options);

axiosWithAuth.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (config?.headers && token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosClassic, axiosWithAuth }