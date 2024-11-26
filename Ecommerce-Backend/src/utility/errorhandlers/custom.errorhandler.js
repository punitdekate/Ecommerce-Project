import { INTERNAL_SERVER_ERROR } from "../../config/constants.js";
import logger from "../logger.js";

export class CustomMongooseError extends Error {
  constructor(errorMessage, errorCode = 500) {
    super(errorMessage);
    this.statusCode = errorCode;
    this.errorStack = this.stack;
  }

  getMessage() {
    return {
      status: false,
      message: errorMessage,
    };
  }
}

export class CustomApplicationError extends Error {
  constructor(errorMessage, errorCode = 500) {
    super(errorMessage);
    this.statusCode = errorCode;
    this.errorStack = this.stack;
  }
  getMessage() {
    return {
      status: false,
      message: errorMessage,
    };
  }
}

const errorHandler = (err, req, res, next) => {
  const logData = `${new Date().toString()}\n Request URL: ${
    req.url
  }\nRequest Body: ${JSON.stringify(req.body)}\nError : ${err}`;
  logger.error(logData);
  if (err) {
    if (err instanceof CustomMongooseError) {
      //handle the database error
      if (err.name == "ValidationError") {
        const errorMessage = Object.values(err.errors).map(
          (val) => val.message
        );
        return res.status(400).json({
          success: false,
          msg: errorMessage,
        });
      } else {
        return res.status(err.statusCode).json({
          success: false,
          msg: err.message,
        });
      }
    } else if (err instanceof CustomApplicationError) {
      //handle the application level error
      return res.status(err.statusCode).json({
        success: false,
        msg: err.message,
      });
    } else {
      //handle the server related error
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: INTERNAL_SERVER_ERROR,
      });
    }
  } else {
    next();
  }
};

export { errorHandler };
