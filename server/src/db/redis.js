const Redis = require("ioredis");

const redisClient = new Redis({
  host:
    process.env.REDIS_HOST ||
    "redis-13767.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: process.env.REDIS_PORT || 13767,
  password: process.env.REDIS_PASSWORD || "Ma3n111WPgn7WMruh0nbVvaz8BYzbiL7", // Use if Redis requires a password
});

module.exports = redisClient;
