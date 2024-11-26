import winston from "winston";
const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "./public/error.log" })],
});
export default logger;
