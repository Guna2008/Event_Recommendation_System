const prisma = require("../connection");
const bcrypt = require("bcryptjs");

// Create a user
const createUserInDB = async (userData) => {
  const data = { ...userData };

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.create({
    data
  });
};

// Verify email + password, return user (without password) or null
const verifyUserCredentials = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    return null;
  }

  const { password: _pw, ...safeUser } = user;
  return safeUser;
};

// Get all users
const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Get user by ID
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
};

// Get user by email
const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email
    }
  });
};

// Update user
const updateUserInDB = async (id, userData) => {
  const data = { ...userData };

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  } else {
    delete data.password;
  }

  return await prisma.user.update({
    where: {
      id: Number(id)
    },
    data
  });
};

// Delete user
const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
};

module.exports = {
  createUserInDB,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserInDB,
  deleteUser,
  verifyUserCredentials
};