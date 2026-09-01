const interactions = [];

const saveInteraction = (req, res) => {
    const {
        userId,
        eventId,
        type
    } = req.body;

    const allowedTypes = [
        "view",
        "bookmark",
        "register"
    ];

    if (!userId || !eventId || !type) {
        return res.status(400).json({
            success: false,
            message: "userId, eventId and type are required"
        });
    }

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid interaction type"
        });
    }

    const interaction = {
        id: interactions.length + 1,
        userId,
        eventId,
        type,
        createdAt: new Date()
    };

    interactions.push(interaction);

    res.status(201).json({
        success: true,
        data: interaction
    });
};

const getUserInteractions = (req, res) => {
    const userId = Number(req.params.userId);

    const userInteractions = interactions.filter(
        (interaction) => interaction.userId === userId
    );

    res.json({
        success: true,
        count: userInteractions.length,
        data: userInteractions
    });
};

module.exports = {
    saveInteraction,
    getUserInteractions
};