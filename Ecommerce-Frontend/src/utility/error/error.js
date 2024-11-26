import { useNavigate } from "react-router-dom";
import errorImage from "../../../src/assets/browser.png";
import styles from "./error.module.css";

function Error() {
  const navigate = useNavigate();
  const handleReturn = () => {
    navigate(-1);
  };
  return (
    <>
      <div className={styles.errorContainer}>
        <div>
          <h1 className={styles.heading}>OOPS! Something went wrong..</h1>
        </div>
        <div>
          <img src={errorImage} className={styles.image} alt='Error-Image' />
        </div>
        <div>
          <button className={styles.btn} onClick={handleReturn}>
            Back
          </button>
        </div>
      </div>
    </>
  );
}
export default Error;
