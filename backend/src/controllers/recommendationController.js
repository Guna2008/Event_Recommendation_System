const {
  getRecommendations,
} = require("../services/recommendationService");

const getUserRecommendations = async (req, res) => {
  try {
    const recommendations = await getRecommendations(
      req.params.userId
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
};

module.exports = {
  getUserRecommendations,
};