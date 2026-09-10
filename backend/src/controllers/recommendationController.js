const {
  getRecommendations
} = require("../services/recommendationService");


const getUserRecommendations = async (req, res) => {

  try {

    const recommendations =
      await getRecommendations(
        req.params.userId
      );


    return res.status(200).json({

      success: true,

      data: recommendations

    });


  } catch (error) {

    console.error(
      "Recommendation error:",
      error
    );


    if (
      error.message ===
      "User not found"
    ) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }


    if (
      error.message ===
      "Invalid user ID"
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid user ID"

      });

    }


    if (
      error.message ===
      "ML recommendation service unavailable"
    ) {

      return res.status(503).json({

        success: false,

        message:
          "Recommendation service unavailable"

      });

    }


    return res.status(500).json({

      success: false,

      message:
        "Failed to generate recommendations"

    });

  }

};


module.exports = {
  getUserRecommendations
};