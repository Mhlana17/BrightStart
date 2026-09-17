const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

async function request(path, options = {}) {
    const token = localStorage.getItem("brightstart_token");
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: "Bearer " + token } : {}),
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
            const body = await response.json();
            message = body.message || body.error || message;
        } catch {
            // Keep the HTTP status when the backend does not return JSON.
        }
        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const api = {
    login: (credentials) =>
        request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        }),
    register: (details) =>
        request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(details)
        }),
    getPrograms: () => request("/api/programs"),
    getProgress: (learnerId = 1) => request(`/api/progress/${learnerId}`),
    createBooking: (booking) =>
        request("/api/bookings", {
            method: "POST",
            body: JSON.stringify(booking)
        })
};
