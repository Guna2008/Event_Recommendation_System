/* ==========================================================
   VECTORED — shared API client
   Talks to the Express backend (backend/src/server.js).
   Change API_BASE if the backend runs somewhere other than
   http://localhost:5000.
========================================================== */

const API_BASE =
  window.VECTORED_API_BASE || "http://localhost:5000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  let body = null;
  try {
    body = await response.json();
  } catch (_) {
    /* no JSON body */
  }

  if (!response.ok) {
    const message =
      (body && (body.message || body.error)) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

const api = {
  // ---------------- Users / auth ----------------
  signup: (userData) =>
    apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData)
    }),

  login: (email, password) =>
    apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  getUser: (id) => apiRequest(`/users/${id}`),

  updateUser: (id, userData) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData)
    }),

  deleteUser: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),

  // ---------------- Events ----------------
  getEvents: () => apiRequest("/events"),

  getEvent: (id) => apiRequest(`/events/${id}`),

  searchEvents: (query) =>
    apiRequest(`/events/search?q=${encodeURIComponent(query)}`),

  getEventsByCategory: (category) =>
    apiRequest(`/events/category/${encodeURIComponent(category)}`),

  createEvent: (eventData) =>
    apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(eventData)
    }),

  updateEvent: (id, eventData) =>
    apiRequest(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData)
    }),

  deleteEvent: (id) =>
    apiRequest(`/events/${id}`, { method: "DELETE" }),

  // ---------------- Registrations ----------------
  registerForEvent: (userId, eventId) =>
    apiRequest("/registrations", {
      method: "POST",
      body: JSON.stringify({ userId, eventId })
    }),

  getUserRegistrations: (userId) =>
    apiRequest(`/registrations/user/${userId}`),

  markAttendance: (userId, eventId) =>
    apiRequest("/registrations/attendance", {
      method: "PUT",
      body: JSON.stringify({ userId, eventId })
    }),

  // ---------------- Feedback ----------------
  submitFeedback: (registrationId, userId, eventId, experience) =>
    apiRequest("/feedback", {
      method: "POST",
      body: JSON.stringify({ registrationId, userId, eventId, experience })
    }),

  getUserFeedback: (userId) => apiRequest(`/feedback/user/${userId}`),

  // ---------------- Interactions ----------------
  saveInteraction: (userId, eventId, type) =>
    apiRequest("/interactions", {
      method: "POST",
      body: JSON.stringify({ userId, eventId, type })
    }),

  // ---------------- Search history ----------------
  saveSearch: (userId, query) =>
    apiRequest("/search", {
      method: "POST",
      body: JSON.stringify({ userId, query })
    }),

  getRecentSearches: (userId, limit = 10) =>
    apiRequest(`/search/user/${userId}/recent?limit=${limit}`),

  // ---------------- Recommendations ----------------
  getRecommendations: (userId) => apiRequest(`/recommendations/${userId}`)
};

/* ==========================================================
   Session helpers (who is currently logged in).
   The backend has no session/JWT layer, so we just cache the
   logged-in user's public profile in localStorage after a
   successful /users/login or /users (signup) call.
========================================================== */

const Session = {
  KEY: "vectoredSession",

  save(user) {
    localStorage.setItem(Session.KEY, JSON.stringify(user));
  },

  get() {
    try {
      return JSON.parse(localStorage.getItem(Session.KEY) || "null");
    } catch (_) {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(Session.KEY);
  }
};
