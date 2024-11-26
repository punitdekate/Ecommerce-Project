import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { connectToDb } from "./src/config/db.config.js";
import userRouter from "./src/routes/users/users.routes.js";
import { errorHandler } from "./src/utility/errorhandlers/custom.errorhandler.js";
import productRouter from "./src/routes/products/products.routes.js";
import { auth } from "./src/middlewares/users/auth.middleware.js";
import cartRouter from "./src/routes/cart/cart.routes.js";
import ordersRouter from "./src/routes/orders/orders.routes.js";
import { sendNotification } from "./src/utility/email.utility.js";
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/api/ecommerce/users/:userId/cart", auth, cartRouter);

// app.use("/api/ecommerce/users/:userId/orders", auth, ordersRouter);

app.use("/api/ecommerce/users", userRouter);

app.use("/api/ecommerce/products", productRouter);

app.use(errorHandler);

app.listen(process.env.PORT_NO, async () => {
  await connectToDb();
  console.log(`server is listening on port ${process.env.PORT_NO}`);
});
