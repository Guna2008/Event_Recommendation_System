const users = [];

const createUser = (req, res) => {
    const {
        name,
        skills,
        interests,
        careerGoal,
        location
    } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    const user = {
        id: users.length + 1,
        name,
        skills: skills || [],
        interests: interests || [],
        careerGoal: careerGoal || null,
        location: location || null
    };

    users.push(user);

    res.status(201).json({
        success: true,
        data: user
    });
};

const getUserById = (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        data: user
    });
};

const updateUser = (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const {
        name,
        skills,
        interests,
        careerGoal,
        location
    } = req.body;

    if (name !== undefined) user.name = name;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;
    if (careerGoal !== undefined) user.careerGoal = careerGoal;
    if (location !== undefined) user.location = location;

    res.json({
        success: true,
        data: user
    });
};

module.exports = {
    createUser,
    getUserById,
    updateUser
};