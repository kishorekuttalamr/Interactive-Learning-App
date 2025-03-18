import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Adjust to match your backend URL
});

// Function to get access and refresh tokens from localStorage
const getTokens = () => {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
};

// Attach access token to requests
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh token
api.interceptors.response.use(
  (response) => response, // If the response is fine, return it as is
  async (error) => {
    const originalRequest = error.config;

    // If access token is expired (401) and this is the first retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getTokens();
        if (!refreshToken) {
          console.error("No refresh token available");
          return Promise.reject(error);
        }

        // Request a new access token using the refresh token
        const refreshResponse = await axios.post("http://localhost:5000/refresh-token", {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data.accessToken;

        // Store new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update headers for the original request and retry
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Retry the failed request
      } catch (refreshError) {
        console.error("Refresh token request failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
