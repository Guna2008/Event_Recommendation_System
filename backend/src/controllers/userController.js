const {
  getUserById,
  getUserByEmail,
  createUserInDB,
  updateUserInDB,
  verifyUserCredentials,
  deleteUser
} = require("../../db/queries/userQueries");

const stripPassword = (user) => {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
};

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

    res.json(stripPassword(user));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required"
      });
    }

    const existing = await getUserByEmail(email.toLowerCase().trim());

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const user = await createUserInDB({
      ...req.body,
      email: email.toLowerCase().trim(),
      preferredMode: req.body.preferredMode || "Online",
      preferredEventType: req.body.preferredEventType || [],
      skills: req.body.skills || [],
      interests: req.body.interests || []
    });

    res.status(201).json(stripPassword(user));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }

    const user = await verifyUserCredentials(
      email.toLowerCase().trim(),
      password
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to log in"
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

    res.json(stripPassword(user));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

const removeUser = async (req, res) => {
  try {
    await deleteUser(Number(req.params.id));

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete user"
    });
  }
};

module.exports = {
  getUser,
  createUser,
  loginUser,
  updateUser,
  removeUser
};
