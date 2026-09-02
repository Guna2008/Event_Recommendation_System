const {
  getUserById,
  createUserInDB,
  updateUserInDB
} = require("../../db/queries/userQueries");

const getUser = async (req, res) => {
  try {
    const user = await getUserById(
      Number(req.params.id)
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await createUserInDB(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await updateUserInDB(
      Number(req.params.id),
      req.body
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser
};