import Card from "../product/card/card";
import styles from "./home.module.css";
import Filter from "../filter/filter";
import {
  getInitialState,
  productListSelector,
} from "../../redux/reducers/productList.reducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { start, end } from "../../redux/reducers/loader.reducer";
import { ToastContainer, toast } from "react-toastify";
function Home() {
  const dispatch = useDispatch();

  const { products, error } = useSelector(productListSelector);

  const loadData = async () => {
    try {
      dispatch(start());
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await dispatch(getInitialState()).unwrap();
      dispatch(end());
    } catch (err) {
      dispatch(end()); // End loader even in case of failure
      toast.error(err.message || "Failed to load products.");
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.leftSection}>
          <Filter />
        </div>
        <div className={styles.rightSection}>
          {products.map((product, index) => (
            <Card product={product} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
