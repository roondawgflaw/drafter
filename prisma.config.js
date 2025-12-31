/** Prisma CLI configuration for Prisma 7 */
require('dotenv').config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};