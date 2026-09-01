const prisma = require("./connection");

async function main() {
  console.log("Database is ready. User data will be added through the application.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });