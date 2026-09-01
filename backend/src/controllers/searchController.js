const {
  createSearchHistory,
  getUserSearchHistory,
  getRecentSearches,
  deleteUserSearchHistory,
} = require("../../db/queries/searchQueries");

const saveSearch = async (req, res) => {
  try {
    const { userId, query } = req.body;

    if (!userId || !query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "userId and query are required",
      });
    }

    const search = await createSearchHistory({
      userId,
      query: query.trim(),
    });

    res.status(201).json({
      success: true,
      data: search,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save search",
    });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const history = await getUserSearchHistory(req.params.userId);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
    });
  }
};

const getRecentSearchHistory = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const history = await getRecentSearches(
      req.params.userId,
      limit
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent searches",
    });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    await deleteUserSearchHistory(req.params.userId);

    res.status(200).json({
      success: true,
      message: "Search history cleared",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear search history",
    });
  }
};

module.exports = {
  saveSearch,
  getSearchHistory,
  getRecentSearchHistory,
  clearSearchHistory,
};