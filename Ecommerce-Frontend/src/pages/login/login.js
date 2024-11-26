import { Link } from "react-router-dom";
import styles from "./login.module.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/reducers/user.reducer";
import { start, end } from "../../redux/reducers/loader.reducer";
import { loaderSelector } from "../../redux/reducers/loader.reducer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
function Login() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const emailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(loaderSelector);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (user.email && user.password) {
        dispatch(start());
        await dispatch(userLogin(user)).unwrap();
        dispatch(end());
        navigate("/");
        toast.success("User logged in successfully");
      }
    } catch (error) {
      dispatch(end());
      toast.error(error || "Failed to login");
    }
  };

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Login</div>
        <div className={styles.loginEmail}>
          <Label name='Email' />
          <input
            type='email'
            className={styles.loginEmailInput}
            placeholder='abc@example.com'
            value={user.email}
            onChange={(e) =>
              setUser({
                name: user.name,
                email: e.target.value,
                password: user.password,
              })
            }
            ref={emailRef}
          />
        </div>
        <div className={styles.loginPassword}>
          <Label name='Password' />
          <input
            type='password'
            className={styles.loginPasswordInput}
            value={user.password}
            onChange={(e) =>
              setUser({
                name: user.name,
                email: user.email,
                password: e.target.value,
              })
            }
          />
        </div>
        <div>
          <button type='submit' className={styles.loginButton}>
            Sign In
          </button>
          <Link to='/register'>
            <button className={styles.loginButton}>Sign Up</button>
          </Link>
        </div>
      </div>
    </form>
  );
}

function Label(props) {
  return <label className={styles.loginLabel}>{props.name}</label>;
}

export default Login;
