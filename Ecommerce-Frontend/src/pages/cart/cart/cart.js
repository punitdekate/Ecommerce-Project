import CartItem from "../cartItem/cartItem";
import cartImage from "../../../assets/shopping-cart.png";
import emptyCart from "../../../assets/empty-cart.png";
import styles from "./cart.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getInitialCart } from "../../../redux/reducers/cart.reducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cartSelector } from "../../../redux/reducers/cart.reducer";
import { userLoginSelector } from "../../../redux/reducers/user.reducer";
import { start, end } from "../../../redux/reducers/loader.reducer";
import { toast } from "react-toastify";
import { placeOrderSelector } from "../../../redux/reducers/placeOrder.reducer";
import { placeOrderThunk } from "../../../redux/reducers/placeOrder.reducer";
import { reset } from "../../../redux/reducers/cart.reducer";

function Cart() {
  const { cart, error } = useSelector(cartSelector);
  const { user } = useSelector(userLoginSelector);
  const { placeOrderError } = useSelector(placeOrderSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loadCart = async () => {
        dispatch(start());
        await dispatch(getInitialCart()).unwrap();
        dispatch(end());
      };
      loadCart();
    } catch (err) {
      dispatch(end());
      toast(error || "Failed to place order");
    }
  }, []);
  const handlePlacedOrder = async () => {
    try {
      dispatch(start());
      const result = await dispatch(placeOrderThunk()).unwrap();
      // Check if the order was placed successfully
      if (result.success) {
        toast.success("Order has been placed successfully");
        // Navigate to the order details page
        navigate(`/${user.id}/order`);
        // Reset the state after successful order placement
        dispatch(end());
        dispatch(reset());
      } else {
        throw new Error("Order placement failed");
      }
    } catch (err) {
      console.log(err);
      dispatch(end());
      toast.error(placeOrderError || err.message);
    }
  };

  return (
    <>
      <div className={styles.cartTitleContainer}>
        <h2 className={styles.title}>
          <img src={cartImage} alt='Cart' className={styles.cartImage} />
          Cart
        </h2>
      </div>
      <div className={styles.cartMainContainer}>
        <div className={styles.cartContainer}>
          {cart.length > 0 ? (
            cart.map((ele) => <CartItem cartItem={ele} key={ele.id} />)
          ) : (
            <div>
              <img src={emptyCart} alt='Cart' className={styles.emptyCart} />
              <h2>Cart is empty...</h2>
            </div>
          )}
        </div>
        {cart.length > 0 ? (
          <div className={styles.totalContainer}>
            <div>
              <h3>
                {"Total = $" +
                  cart
                    .reduce((acc, curVal) => {
                      return acc + parseFloat(curVal.price * curVal.count);
                    }, 0)
                    .toFixed(2)}
              </h3>
            </div>
            <div>
              <button
                className={styles.placeOrderButton}
                onClick={() => handlePlacedOrder(cart)}
              >
                Place Order
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Cart;
