import logoImage from "../../assets/shopping.png";
import cartImage from "../../assets/shopping-cart.png";
import profileImage from "../../assets/profile-user.png";
import orderImage from "../../assets/tracking.png";
import styles from "./navbar.module.css";
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import Loader from "../../utility/Loader/loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userLoginSelector } from "../../redux/reducers/user.reducer";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/user.reducer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSearchProductList } from "../../redux/reducers/productList.reducer";
import { loaderSelector } from "../../redux/reducers/loader.reducer";
import { start, end } from "../../redux/reducers/loader.reducer";
function Navbar() {
  const { isLoggedIn, user } = useSelector(userLoginSelector);
  const { isLoading } = useSelector(loaderSelector);
  const [searchInput, setSearchInput] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToOrders = () => {
    if (isLoggedIn) {
      navigate(`${user.id}/order`);
    } else {
      navigate("/login");
    }
  };

  const goToCart = () => {
    isLoggedIn ? navigate(`${user.id}/cart`) : navigate("/login");
  };

  const handleLogin = () => {
    if (isLoggedIn) {
      dispatch(start());
      dispatch(logout());
      dispatch(end());
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(start());
    dispatch(getSearchProductList(searchInput));
    dispatch(end());
  }, [searchInput]);

  useEffect(() => {console.log(isLoading)}, [isLoading]);

  return (
    <>
      <nav className={styles.navbarContainer}>
        <div className={styles.logoContainer}>
          <Link to={"/"}>
            <img src={logoImage} alt='Logo' className={styles.logo} />
          </Link>
        </div>
        <div className={styles.searchInputContainer}>
          <input
            className={styles.searchInput}
            placeholder='Search...'
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>
        <div className={styles.rightContainer}>
          {isLoggedIn ? (
            <div>
              <span className={styles.userName}>Hello {user.name}</span>
            </div>
          ) : null}
          <div className={styles.orderImageContainer}>
            <button onClick={goToOrders} className={styles.decorationButton}>
              <img src={orderImage} alt='Order' className={styles.orderImage} />
            </button>
          </div>
          <div className={styles.cartImageContainer}>
            <button onClick={goToCart} className={styles.decorationButton}>
              <img src={cartImage} alt='Cart' className={styles.cartImage} />
            </button>
          </div>
          <div className={styles.loginContainer}>
            <button className={styles.loginButton} onClick={handleLogin}>
              {isLoggedIn ? "Logout" : "Login"}{" "}
            </button>
          </div>
          {isLoggedIn ? (
            <div className={styles.profileContainer}>
              <NavLink>
                <img src={profileImage} alt='profile' />
              </NavLink>
            </div>
          ) : null}
          {isLoading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
        </div>
      </nav>
      <ToastContainer className={styles.toastContainer} />
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
