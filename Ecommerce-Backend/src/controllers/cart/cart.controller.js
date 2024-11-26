import {
  INTERNAL_SERVER_ERROR,
  PRODUCT_ID_IS_REQUIRED,
} from "../../config/constants.js";
import CartRepository from "../../repositories/cart/cart.repository.js";
import { CustomApplicationError } from "../../utility/errorhandlers/custom.errorhandler.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getUserCart(req, res, next) {
    try {
      const userId = req.user.id;
      const dbResponse = await this.cartRepository.getByUserId(userId);
      return res.status(200).json(dbResponse);
    } catch (error) {
      next(CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
    }
  }

  async addToUserCart(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      if (!productId) {
        throw CustomApplicationError(PRODUCT_ID_IS_REQUIRED, 400);
      }
      const dbResponse = await this.cartRepository.add(productId, userId);
      return res.status(200).json(dbResponse);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductFromUserCart(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      if (!productId) {
        throw CustomApplicationError(PRODUCT_ID_IS_REQUIRED, 400);
      }
      const dbResponse = await this.cartRepository.removeProductFromCart(
        productId,
        userId
      );
      return res.status(200).json(dbResponse);
    } catch (error) {
      next(error);
    }
  }

  async updateCartProduct(req, res, next) {
    try {
      const productId = req.params.productId;
      const userId = req.user.id;
      const { op } = req.query;
      if (!op) {
        throw new CustomApplicationError("Operation is not passed", 400);
      }
      const dbResponse = await this.cartRepository.updateCartQuantity(
        productId,
        userId,
        op
      );
      return res.status(200).json(dbResponse);
    } catch (error) {
      next(error);
    }
  }
}
