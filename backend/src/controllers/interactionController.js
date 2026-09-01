const {
  createInteraction,
  getUserInteractions,
  deleteInteraction,
} = require("../../db/queries/interactionQueries");

const saveInteraction = async (req, res) => {
  try {
    const { userId, eventId, type } = req.body;

    if (!userId || !eventId || !type) {
      return res.status(400).json({
        success: false,
        message: "userId, eventId and type are required",
      });
    }

    const interaction = await createInteraction({
      userId,
      eventId,
      type,
    });

    res.status(201).json({
      success: true,
      message: "Interaction saved successfully",
      data: interaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save interaction",
    });
  }
};

const getUserInteractionController = async (req, res) => {
  try {
    const interactions = await getUserInteractions(req.params.userId);

    res.status(200).json({
      success: true,
      data: interactions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interactions",
    });
  }
};

const deleteInteractionController = async (req, res) => {
  try {
    await deleteInteraction(req.params.id);

    res.status(200).json({
      success: true,
      message: "Interaction deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete interaction",
    });
  }
};

module.exports = {
  saveInteraction,
  getUserInteractionController,
  deleteInteractionController,
};