import { PRODUCT_ID_IS_REQUIRED } from "../../config/constants.js";
import { CustomApplicationError } from "../../utility/errorhandlers/custom.errorhandler.js";

export const validateParameterId = (req, res, next) => {
  if (!req.params?.id) {
    return next(new CustomApplicationError(PRODUCT_ID_IS_REQUIRED));
  }
  next();
};
