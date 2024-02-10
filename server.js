const app = require('./app');
const config = require('./config/project.config');
const Logger = require('./config/winston');
const prisma = require('./prisma/prismaClient');

async function main() {
  const server = await app.listen(process.env.PORT, () => {
    Logger.info(`Server ready at: http://localhost:${process.env.PORT}`);
  });
}

main()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
