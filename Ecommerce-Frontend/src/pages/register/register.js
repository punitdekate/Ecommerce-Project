import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import {
  userLoginSelector,
  userRegister,
} from "../../redux/reducers/user.reducer";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { start, end } from "../../redux/reducers/loader.reducer";

function Register() {
  const { error } = useSelector(userLoginSelector);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (userData.name && userData.email && userData.password) {
        dispatch(start());
        await dispatch(userRegister(userData)).unwrap();
        dispatch(end());
        navigate("/login");
        toast.success("user registered succefully");
      }
    } catch (err) {
      dispatch(end());
      toast.error(error || "Failed to register userData.");
    }
  };

  return (
    <form onSubmit={(e) => handleRegister(e)}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Register</div>
        <div className={styles.loginEmail}>
          <Label name='Name' />
          <input
            type='text'
            className={styles.loginEmailInput}
            value={userData.name}
            onChange={(e) =>
              setUserData({
                name: e.target.value,
                email: userData.email,
                password: userData.password,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div className={styles.loginEmail}>
          <Label name='Email' />
          <input
            type='email'
            className={styles.loginEmailInput}
            value={userData.email}
            onChange={(e) =>
              setUserData({
                name: userData.name,
                email: e.target.value,
                password: userData.password,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div className={styles.loginPassword}>
          <Label name='Password' />
          <input
            type='password'
            className={styles.loginPasswordInput}
            value={userData.password}
            onChange={(e) =>
              setUserData({
                name: userData.name,
                email: userData.email,
                password: e.target.value,
                role: userData.role,
              })
            }
            required
          />
        </div>
        <div>
          <button className={styles.loginButton} type='submit'>
            Sign Up
          </button>
          <Link to='/login'>
            <button className={styles.loginButton}>Sign In</button>
          </Link>
        </div>
      </div>
    </form>
  );
}

function Label(props) {
  return <label className={styles.loginLabel}>{props.name}</label>;
}

export default Register;
