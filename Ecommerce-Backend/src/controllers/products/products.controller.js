import ProductRepository from "../../repositories/products/products.repository.js";
import {
  CustomApplicationError,
  CustomMongooseError,
} from "../../utility/errorhandlers/custom.errorhandler.js";
import {
  COUNT,
  ID_NOT_PRESENT,
  INTERNAL_SERVER_ERROR,
  MAX_PAGE_SIZE,
  PRODUCT_ID_IS_REQUIRED,
  PRODUCT_NOT_EXIST,
  STARTINDEX,
} from "../../config/constants.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProduct(req, res, next) {
    try {
      const id = req.params.productId;
      if (!id) {
        throw new CustomApplicationError(PRODUCT_NOT_EXIST, 400);
      }
      const dbResponse = await this.productRepository.getById(id);
      return res.status(200).json(dbResponse);
    } catch (error) {}
  }

  async getAllProducts(req, res, next) {
    try {
      let count = COUNT;
      if (req?.query?.count) {
        if (req.query.count <= MAX_PAGE_SIZE) {
          count = req.query.count;
        } else {
          count = MAX_PAGE_SIZE;
        }
      }
      let startIndex = STARTINDEX;
      if (req?.query?.startIndex) {
        startIndex = req?.query?.startIndex;
      }

      const dbResponse = await this.productRepository.getAll(
        count,
        startIndex,
        { ...req.query }
      );
      return res.status(200).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }

  async createProduct(req, res, next) {
    try {
      const id = req.user.id;
      req.body.createdBy = id;
      const dbResponse = await this.productRepository.create(req.body);
      return res.status(201).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }

  async modifyProduct(req, res, next) {
    try {
      const id = req.user.id;
      const productId = req.params.productId;
      if (!productId) {
        throw CustomApplicationError(PRODUCT_ID_IS_REQUIRED, 400);
      }
      const dbResponse = await this.productRepository.update(
        id,
        productId,
        req.body
      );
      return res.status(200).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }

  async deleteProduct(id) {
    try {
      const dbResponse = await this.productRepository.delete(id);
      return res.status(204).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }
}
