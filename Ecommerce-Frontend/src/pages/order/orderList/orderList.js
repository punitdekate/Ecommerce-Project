import styles from "./orderList.module.css";
import OrderItem from "../orderItem/orderItem";
import emptyOrder from "../../../assets/empty-box.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitialOrders } from "../../../redux/reducers/orders.reducer";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";
import { ordersSelector } from "../../../redux/reducers/orders.reducer";
function OrderList() {
  const { orders, error } = useSelector(ordersSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    const laodOrders = async () => {
      try {
        dispatch(start());
        await dispatch(getInitialOrders()).unwrap();
        dispatch(end());
      } catch (err) {
        dispatch(end());
        toast(error || err.message);
      } finally {
        dispatch(end());
      }
    };
    laodOrders();
  }, [dispatch, error]);
  return (
    <>
      <div className={styles.orderTitleContainer}>
        <h2 className={styles.orderTitle}>Orders</h2>
      </div>

      <div className={styles.orderListContainer}>
        {orders.length > 0 ? (
          orders.map((order) => <OrderItem order={order} key={order.id} />)
        ) : (
          <div>
            <img src={emptyOrder} alt='Cart' className={styles.emptyOrder} />
            <h2>Order is empty...</h2>
          </div>
        )}
      </div>
    </>
  );
}
export default OrderList;
