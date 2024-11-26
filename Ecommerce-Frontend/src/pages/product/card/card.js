import styles from "./card.module.css";
import { useNavigate } from "react-router-dom";
import { addToCartThunk } from "../../../redux/reducers/cart.reducer";
import { useDispatch, useSelector } from "react-redux";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";
import { userLoginSelector } from "../../../redux/reducers/user.reducer";
function Card({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(userLoginSelector);

  const handleAddToCart = async (product) => {
    try {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      dispatch(start());
      await dispatch(addToCartThunk(product)).unwrap();
      dispatch(end());
      toast.success("Product added to the cart");
    } catch (error) {
      dispatch(end());
      toast.error(error.message || "Failed to add product into cart");
    }
  };
  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.cardImageContainer}>
          <img src={product.image} alt='' className={styles.cardImage} />
        </div>
        <div className={styles.cardTitle}>{product.title}</div>
        <div className={styles.cardPrice}>$ {product.price}</div>
        <div className={styles.cardButtonContainer}>
          <div className={styles.addToCartContainer}>
            <button
              className={styles.addToCartButton}
              onClick={() => handleAddToCart(product)}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
