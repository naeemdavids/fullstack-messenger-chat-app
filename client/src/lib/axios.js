import axios from "axios";

// Create a customized axios instance with a base API URL and cookie support.
// This makes HTTP requests consistent throughout the project and simplifies authentication.
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});
