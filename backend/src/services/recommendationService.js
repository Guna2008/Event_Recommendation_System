const prisma = require("../../db/connection");

// ================================================================
// Simple content-based recommendation engine.
//
// Scores each upcoming event against the requesting user's stated
// preferences (skills, interests, preferred event types, preferred
// mode) plus a light boost from things the user has already shown
// interest in (past interactions + search history).
// ================================================================

const normalize = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .trim();

const tokenize = (list = []) =>
  list.map((item) => normalize(item)).filter(Boolean);

const textContains = (haystack, needle) =>
  needle && normalize(haystack).includes(needle);

const scoreEvent = (event, user, keywordBoosts) => {
  let score = 0;

  const eventText = [
    event.title,
    event.description,
    event.domain,
    event.organizerDepartment,
    event.organizerName
  ]
    .filter(Boolean)
    .join(" ");

  const skills = tokenize(user.skills);
  const interests = tokenize(user.interests);
  const eventTypes = tokenize(user.preferredEventType);

  // Skills / interests matching event text (title, description, domain)
  skills.forEach((skill) => {
    if (textContains(eventText, skill)) score += 3;
  });

  interests.forEach((interest) => {
    if (textContains(eventText, interest)) score += 3;
  });

  // Preferred event type vs event domain
  eventTypes.forEach((type) => {
    if (textContains(event.domain, type) || textContains(event.title, type)) {
      score += 4;
    }
  });

  // Preferred mode (Online/Offline/Hybrid) vs event location text
  if (user.preferredMode && event.location) {
    if (normalize(event.location).includes(normalize(user.preferredMode))) {
      score += 1;
    }
  }

  // Boost from past interactions / searches (keyword overlap)
  keywordBoosts.forEach((keyword) => {
    if (textContains(eventText, keyword)) score += 1.5;
  });

  // Small recency boost so soonest upcoming events edge out later ones
  // when scores tie.
  if (event.date) {
    const daysAway =
      (new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysAway >= 0) {
      score += Math.max(0, 1 - daysAway / 60);
    }
  }

  return score;
};

const getRecommendations = async (userId) => {
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    throw new Error("Invalid user ID");
  }

  const [user, events, interactions, searches] = await Promise.all([
    prisma.user.findUnique({ where: { id: numericUserId } }),

    prisma.event.findMany({
      where: {
        OR: [{ date: null }, { date: { gte: new Date() } }]
      },
      orderBy: { date: "asc" }
    }),

    prisma.interaction.findMany({
      where: { userId: numericUserId },
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),

    prisma.searchHistory.findMany({
      where: { userId: numericUserId },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  // Build a small set of keywords the user has recently engaged with,
  // used to lightly boost similar events.
  const keywordBoosts = new Set();

  interactions.forEach((interaction) => {
    if (interaction.event?.domain) {
      keywordBoosts.add(normalize(interaction.event.domain));
    }
  });

  searches.forEach((search) => {
    normalize(search.query)
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .forEach((word) => keywordBoosts.add(word));
  });

  const scored = events.map((event) => ({
    ...event,
    recommendationScore: scoreEvent(event, user, [...keywordBoosts])
  }));

  scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

  // If the user has no preferences/history at all, every score will be
  // ~0 (or just the recency boost) — that's fine, it degrades gracefully
  // into "soonest upcoming events first".
  return scored.slice(0, 20);
};

module.exports = {
  getRecommendations
};
