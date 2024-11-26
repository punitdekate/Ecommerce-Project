import express from "express";
import { auth } from "../../middlewares/users/auth.middleware.js";
import ProductController from "../../controllers/products/products.controller.js";
import { roleBasedAuth } from "../../middlewares/products/role.auth.middleware.js";
import { validateProduct } from "../../middlewares/products/products.middleware.js";
import { validateParameterId } from "../../middlewares/products/validateid.middleware.js";
const productRouter = express.Router();

const productController = new ProductController();
productRouter.get("/", (req, res, next) => {
  productController.getAllProducts(req, res, next);
});

productRouter.get("/:producId", validateParameterId, (req, res, next) => {
  productController.getProduct(req, res, next);
});

productRouter.post(
  "/",
  auth,
  roleBasedAuth,
  validateProduct,
  (req, res, next) => {
    productController.createProduct(req, res, next);
  }
);

productRouter.put(
  "/:productId",
  auth,
  roleBasedAuth,
  validateParameterId,
  (req, res, next) => {
    productController.modifyProduct(req, res, next);
  }
);

productRouter.delete(
  "/:productId",
  auth,
  roleBasedAuth,
  validateParameterId,
  (req, res, next) => {
    productController.deleteProduct(req, res, next);
  }
);

export default productRouter;
