// API Base URL configuration
// Uses environment variable, falls back to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Create full API URL
export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with /
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${formattedEndpoint}`;
};
