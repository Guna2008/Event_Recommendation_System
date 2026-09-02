const validateUser = (req, res, next) => {
    const {
        name,
        skills,
        interests
    } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    if (skills && !Array.isArray(skills)) {
        return res.status(400).json({
            success: false,
            message: "Skills must be an array"
        });
    }

    if (interests && !Array.isArray(interests)) {
        return res.status(400).json({
            success: false,
            message: "Interests must be an array"
        });
    }

    next();
};

module.exports = {
    validateUser
};
