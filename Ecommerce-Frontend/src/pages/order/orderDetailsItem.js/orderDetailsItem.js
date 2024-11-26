import styles from "./orderDetailsItem.module.css";
function OrderDetailsItem({ product }) {
  return (
    <>
      <div className={styles.orderItemContainer}>
        <div className={styles.orderItemImageContainer}>
          <img
            src={product.image}
            alt='product image'
            className={styles.orderItemImage}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.itemDetailContainer}>
            <p>{product.title}</p>
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              ${product.price} x {product.count}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsItem;
