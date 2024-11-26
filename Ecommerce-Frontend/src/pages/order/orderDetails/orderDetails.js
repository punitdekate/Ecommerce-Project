import styles from "./orderDetails.module.css";
import OrderDetailsItem from "../orderDetailsItem.js/orderDetailsItem";
import orderImage from "../../../assets/tracking.png";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ordersSelector } from "../../../redux/reducers/orders.reducer";
import { useDispatch } from "react-redux";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";
function OrderDetails() {
  const { orders, error } = useSelector(ordersSelector);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null); // Start with null
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      dispatch(start());
      const orderData = orders.find(
        (ele) => Number(ele.id) === Number(orderId)
      );
      if (orderData) {
        setOrderDetails(orderData);
        dispatch(end());
      }
    } catch (err) {
      dispatch(end());
      toast.error(error || err.message);
    } finally {
      dispatch(end());
    }
  }, [orders, orderId]);

  if (!orderDetails) {
    return <div></div>;
  }

  return (
    <>
      <div className={styles.orderDetailsTitle}>
        <h2>
          <img src={orderImage} alt='Order' className={styles.orderImage} />
          Order Details
        </h2>
      </div>
      <div className={styles.orderDetails}>
        <div className={styles.orderDetailsContainer}>
          <div className={styles.orderId}>
            <p>
              <b>Order ID : </b>
              {orderDetails.id}
            </p>
          </div>
          <div className={styles.orderDate}>
            <p>
              <b>Order Date : </b>
              {orderDetails.date}
            </p>
          </div>
          <hr />
        </div>
        <div className={styles.items}>
          {orderDetails.order && orderDetails.order.length > 0 ? (
            orderDetails.order.map((ele) => (
              <OrderDetailsItem product={ele} key={ele.id} />
            ))
          ) : (
            <div>No items in this order.</div>
          )}
        </div>
        <div className={styles.total}>Total: {orderDetails.total}</div>
      </div>
    </>
  );
}

export default OrderDetails;
