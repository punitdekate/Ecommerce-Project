import styles from "./cartItem.module.css";
import plusImage from "../../../assets/plus.png";
import minusImage from "../../../assets/minus-button.png";
import {
  cartSelector,
  removeFromCartThunk,
  opCartThunk,
} from "../../../redux/reducers/cart.reducer";
import { useDispatch, useSelector } from "react-redux";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";

function CartItem({ cartItem }) {
  const dispatch = useDispatch();
  const { error } = useSelector(cartSelector);
  const handleRemove = async (productId) => {
    try {
      dispatch(start());
      await dispatch(removeFromCartThunk(productId)).unwrap();
      dispatch(end());
    } catch (err) {
      dispatch(end());
      toast(error || err.message);
    }
  };

  const handleOpCart = async (productId, op) => {
    try {
      dispatch(start());
      await dispatch(opCartThunk({ productId, op })).unwrap();
      dispatch(end());
    } catch (err) {
      dispatch(end());
      toast(error || err.message);
    }
  };
  return (
    <>
      <div className={styles.cartItemContainer}>
        <div className={styles.cartItemImageContainer}>
          <img
            src={cartItem.image}
            alt='product image'
            className={styles.itemImage}
          />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.itemDetailContainer}>
            <p>{cartItem.title}</p>
            <p>${cartItem.price}</p>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.cardButtonContainer}>
              <div className={styles.cardMinusContainer}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleOpCart(cartItem.id, "sub")}
                >
                  <img
                    src={minusImage}
                    alt='-'
                    className={styles.removeImage}
                  />
                </button>
              </div>

              <div className={styles.cardCountContainer}>
                <p className={styles.count}>
                  <b>{cartItem.count}</b>
                </p>
              </div>

              <div className={styles.cardAddContainer}>
                <button
                  className={styles.addButton}
                  onClick={() => handleOpCart(cartItem.id, "add")}
                >
                  <img src={plusImage} alt='+' className={styles.addImage} />
                </button>
              </div>
              <div className={styles.addToCartContainer}>
                <button
                  className={styles.removeFromCartButton}
                  onClick={() => handleRemove(cartItem.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
