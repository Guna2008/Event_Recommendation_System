const API_BASE =
  window.VECTORED_API_BASE || "http://localhost:5000";


/* =========================================================
   COMMON API REQUEST
========================================================= */

async function apiRequest(path, options = {}) {

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );


  let body = null;

  try {
    body = await response.json();
  } catch (_) {
    // Response did not contain JSON
  }


  if (!response.ok) {

  console.error("API ERROR");
  console.error("Status:", response.status);
  console.error("Response body:", body);

  const message =
    body?.message ||
    body?.error ||
    body?.detail ||
    `Request failed (${response.status})`;

  const error = new Error(message);

  error.status = response.status;
  error.body = body;

  throw error;
}
}


/* =========================================================
   API
========================================================= */

const api = {


  /* =========================
     USERS
  ========================== */

  signup: (userData) =>
    apiRequest(
      "/users",
      {
        method: "POST",
        body: JSON.stringify(userData)
      }
    ),


  login: (email, password) =>
    apiRequest(
      "/users/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      }
    ),


  getUser: (id) =>
    apiRequest(
      `/users/${id}`
    ),


  updateUser: (id, userData) =>
    apiRequest(
      `/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(userData)
      }
    ),


  deleteUser: (id) =>
    apiRequest(
      `/users/${id}`,
      {
        method: "DELETE"
      }
    ),



  /* =========================
     EVENTS
  ========================== */

  getEvents: () =>
    apiRequest(
      "/events"
    ),


  getEvent: (id) =>
    apiRequest(
      `/events/${id}`
    ),


  searchEvents: (query) =>
    apiRequest(
      `/events/search?q=${encodeURIComponent(query)}`
    ),


  getEventsByCategory: (category) =>
    apiRequest(
      `/events/category/${encodeURIComponent(category)}`
    ),


  createEvent: (eventData) =>
    apiRequest(
      "/events",
      {
        method: "POST",
        body: JSON.stringify(eventData)
      }
    ),


  updateEvent: (id, eventData) =>
    apiRequest(
      `/events/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(eventData)
      }
    ),


  deleteEvent: (id) =>
    apiRequest(
      `/events/${id}`,
      {
        method: "DELETE"
      }
    ),



  /* =========================
     REGISTRATIONS
  ========================== */

  registerForEvent: (
    userId,
    eventId
  ) =>
    apiRequest(
      "/registrations",
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          eventId
        })
      }
    ),


  getUserRegistrations: (
    userId
  ) =>
    apiRequest(
      `/registrations/user/${userId}`
    ),


  markAttendance: (
    userId,
    eventId
  ) =>
    apiRequest(
      "/registrations/attendance",
      {
        method: "PUT",
        body: JSON.stringify({
          userId,
          eventId
        })
      }
    ),



  /* =========================
     FEEDBACK
  ========================== */

  submitFeedback: (
    registrationId,
    userId,
    eventId,
    experience
  ) =>
    apiRequest(
      "/feedback",
      {
        method: "POST",
        body: JSON.stringify({
          registrationId,
          userId,
          eventId,
          experience
        })
      }
    ),


  getUserFeedback: (
    userId
  ) =>
    apiRequest(
      `/feedback/user/${userId}`
    ),



  /* =========================
     INTERACTIONS
  ========================== */

  saveInteraction: (
    userId,
    eventId,
    type
  ) =>
    apiRequest(
      "/interactions",
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          eventId,
          type
        })
      }
    ),



  /* =========================
     SEARCH HISTORY
  ========================== */

  saveSearch: (
    userId,
    query
  ) =>
    apiRequest(
      "/search",
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          query
        })
      }
    ),


  getRecentSearches: (
    userId,
    limit = 10
  ) =>
    apiRequest(
      `/search/user/${userId}/recent?limit=${limit}`
    ),



  /* =========================
     ML RECOMMENDATIONS
  ========================== */

  getRecommendations: (
    userId
  ) =>
    apiRequest(
      `/recommendations/${userId}`
    ),


  /* =========================
     CERTIFICATES
     (registrations with attendance = proxy for certificates)
  ========================== */

  getUserCertificates: (
    userId
  ) =>
    apiRequest(
      `/registrations/user/${userId}/certificates`
    ),


  /* =========================
     ADMIN UTILITIES
  ========================== */

  clearAllEvents: () =>
    apiRequest(
      "/events",
      { method: "DELETE" }
    )

};


/* =========================================================
   SESSION
========================================================= */

const Session = {

  KEY: "vectoredSession",


  save(user) {

    localStorage.setItem(
      this.KEY,
      JSON.stringify(user)
    );

  },


  get() {

    try {

      return JSON.parse(
        localStorage.getItem(
          this.KEY
        ) || "null"
      );

    } catch (error) {

      console.error(
        "Failed to read session:",
        error
      );

      return null;

    }

  },


  clear() {

    localStorage.removeItem(
      this.KEY
    );

  }

};