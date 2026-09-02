require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function test() {
  try {
    console.log("Testing database...");

    const events = await prisma.event.findMany();

    console.log("SUCCESS");
    console.log(events);
  } catch (error) {
    console.error("DATABASE TEST FAILED:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
