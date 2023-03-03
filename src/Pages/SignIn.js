import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProgressBar from "../Components/ProgressBar";
import formImage from "../images/formImage.avif";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./forms.module.scss";
const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const logIn = async (data, e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(true);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
      onlineState: true,
    });
    navigate("/home");
    }
    catch(error) {
      alert(error)
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading == false ? (
        <>
          <div className={styles.formImage} style={{ height: "100%", width: "50%" }}>
            <img
              src={formImage}
              style={{ width: "100%", height: "100%" }}
            ></img>
          </div>
          <form onSubmit={handleSubmit(logIn)}>
            <h1>Sign In</h1>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              placeholder="Email"
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            ></input>
            {errors?.email && (
              <div className={styles.errorBlock}>
                <span>
                  <b>{errors.email.message}</b>
                </span>
              </div>
            )}
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              placeholder="Password"
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "The password must be at least 8 characters long",
                },
              })}
            ></input>
            {errors?.password && (
              <div className={styles.errorBlock}>
                <span>
                  <b>{errors.password.message}</b>
                </span>
              </div>
            )}
            <Button
              type="submit"
              disabled={!isValid}
              variant="contained"
              sx={{
                height: "50px",
                backgroundColor: "#4b28fa",
                marginTop: "10px",
                ":hover": { backgroundColor: "#4b28fa" },
              }}
            >
              Sign In
            </Button>
            <div className={styles.already}>
              <span>Don't have an account yet?</span>
              <Link to="/signUp">Sign Up</Link>
            </div>
          </form>
        </>
      ) : (
        <ProgressBar />
      )}
    </>
  );
};

export default SignIn;
