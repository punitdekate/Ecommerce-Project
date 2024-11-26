import { useEffect, useState } from "react";
import styles from "./filter.module.css";
import { getFilterProductList } from "../../redux/reducers/productList.reducer";
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector } from "../../redux/reducers/productCategories.reducer";
import { toast } from "react-toastify";
import { start, end } from "../../redux/reducers/loader.reducer";

function Filter() {
  const [min] = useState(0); // Keeping default min as 0
  const [max] = useState(20000); // Default max as 20000
  const [price, setPrice] = useState(null); // Default price to null initially
  const [selectedCategory, setSelectedCategory] = useState([]); // Track selected categories

  const { categories } = useSelector(categoriesSelector); // Fetch categories from the store
  const dispatch = useDispatch();

  // Function to handle the filtering of products
  const loadData = async () => {
    try {
      dispatch(start());
      const payload = {};

      // Add price filter if price is not null
      if (price !== null) {
        payload.price = price;
      }

      // Add selected categories filter if any category is selected
      if (selectedCategory.length > 0) {
        payload.selectedCategory = [...selectedCategory];
      }
      await dispatch(getFilterProductList(payload)).unwrap();
      dispatch(end());
    } catch (err) {
      dispatch(end());
      toast.error(err.message || "Failed to load products.");
    }
  };

  // UseEffect to trigger loadData on price or selectedCategory changes
  useEffect(() => {
    loadData();
  }, [price, selectedCategory]); // Run when price or selectedCategory changes

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.filterContainer}>Filters</div>
        <div className={styles.section}>
          <div className={styles.section1}>
            <div>
              <h4 className={styles.section1_title}>Select Price Range</h4>
            </div>
            <div className={styles.dropdownContainer}>
              <input
                type='range'
                min={min}
                max={max}
                value={price || 10000} // Ensure price defaults to 0 if not set
                onChange={(e) => setPrice(e.target.value)}
              />
              <div>
                <span>Selected Price: {price ? price : 10000}</span>{" "}
                {/* Display selected price */}
              </div>
            </div>
          </div>

          <div className={styles.section2}>
            <div>
              <h4 className={styles.section2_title}>Category</h4>
            </div>
            <div className={styles.checkboxContainer}>
              {categories?.length > 0
                ? categories.map((ele) => (
                    <div key={ele} className={styles.checkBox}>
                      <input
                        type='checkbox'
                        id={`category-${ele}`}
                        className={styles.styledCheckbox}
                        value={ele}
                        checked={selectedCategory.includes(ele.toLowerCase())} // Make sure the checkbox reflects the selection state
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Add category to selectedCategories
                            setSelectedCategory((prev) => [
                              ...prev,
                              e.target.value.toLowerCase(),
                            ]);
                          } else {
                            // Remove category from selectedCategories
                            setSelectedCategory((prev) =>
                              prev.filter(
                                (category) =>
                                  category !== e.target.value.toLowerCase()
                              )
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`category-${ele}`}
                        className={styles.checkboxLabel}
                      >
                        {ele}
                      </label>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filter;
