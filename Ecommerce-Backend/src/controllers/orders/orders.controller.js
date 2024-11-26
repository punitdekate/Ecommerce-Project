import OrdersRepository from "../../repositories/orders/orders.repository.js";

export default class OrdersController {
  constructor() {
    this.orderRepository = new OrdersRepository();
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const dbResponse = await this.orderRepository.getAllOrders(userId);
      return res.status(200).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }

  async placeOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const orderData = req.body;
      orderData.user = userId;
      const dbResponse = await this.orderRepository.addOrder(userId, orderData);
      return res.status(200).json(dbResponse);
    } catch (error) {
      if (error instanceof CustomMongooseError) {
        next(error);
      } else {
        next(new CustomApplicationError(INTERNAL_SERVER_ERROR, 500));
      }
    }
  }
}
