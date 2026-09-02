const prisma = require("../connection");

// Create a user
const createUserInDB = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
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
  return await prisma.user.update({
    where: {
      id: Number(id)
    },
    data: userData
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
  deleteUser
};