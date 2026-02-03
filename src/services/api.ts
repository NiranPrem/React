import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import ToastService from "./toastService";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 20000,
	withCredentials: true,
});

let isLoggingOut = false;

// Request interceptor
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		const lang = localStorage.getItem("i18nextLng") || "en";
		config.headers["Accept-Language"] = lang;

		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401 && !isLoggingOut) {
			isLoggingOut = true;
			// Clear tokens and redirect
			ToastService.showError("Your session has expired. Please log in again.");
			localStorage.removeItem("token");
			localStorage.removeItem("refreshToken");
			setTimeout(() => {
				globalThis.location.href = "/login";
			}, 1500);
		}
		if (error.response?.status === 403 && !isLoggingOut) {
			isLoggingOut = true;
			// Clear tokens and redirect
			ToastService.showError("Your session has expired. Please log in again.");
			localStorage.removeItem("token");
			localStorage.removeItem("refreshToken");
			setTimeout(() => {
				globalThis.location.href = "/login";
			}, 1500);
		}
		throw error;
	}
);

export default api;
