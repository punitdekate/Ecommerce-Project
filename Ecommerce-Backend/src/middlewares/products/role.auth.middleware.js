import jwt from "jsonwebtoken";
import { CustomApplicationError } from "../../utility/errorhandlers/custom.errorhandler.js";
import {
  INTERNAL_SERVER_ERROR,
  NOT_AUTHORIZED,
} from "../../config/constants.js";

export async function roleBasedAuth(req, res, next) {
  try {
    if (req?.user?.role === "seller") {
      next();
    } else {
      return res.status(400).json({ status: false, message: NOT_AUTHORIZED });
    }
  } catch (error) {
    throw new CustomApplicationError(INTERNAL_SERVER_ERROR);
  }
}
