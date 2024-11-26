import orderImage from "../../../assets/order.png";
import styles from "./orderItem.module.css";
import { Link } from "react-router-dom";
function OrderItem({ order }) {
  return (
    <>
      <Link to={`${order.id}`} className={styles.orderItemContainerLink}>
        <div className={styles.orderItemContainer}>
          <div className={styles.orderItemImageContainer}>
            <img src={orderImage} alt='' className={styles.orderItemImage} />
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.itemDetailContainer}>
              <p>
                <b>Order Id : </b>
                {order.id}
              </p>
              <p>
                <b>Date Of Order : </b>
                {order.date.substring(0, 28)}
              </p>
            </div>
            <div className={styles.priceContainer}>
              <div className={styles.price}>
                <b>Total :</b> ${order.total}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default OrderItem;
