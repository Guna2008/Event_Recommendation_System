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

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
};

module.exports = {
  getUserRecommendations,
};