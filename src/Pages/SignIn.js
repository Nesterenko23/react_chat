import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProgressBar from '../Components/ProgressBar'
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from './forms.module.scss'
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
    setLoading(true);
    await signInWithEmailAndPassword(auth, data.email, data.password);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      onlineState: true,
    });
    setLoading(false);
    navigate("/home");
  };

  return (
    <>
    {
      loading == false ? 
      <form onSubmit={handleSubmit(logIn)}>
      <h1>Sign In</h1>
      <label className={styles.label} htmlFor="email">Email</label>
      <input
        placeholder="Email"
        id="email"
        type="email"
        {...register("email", {
          required: "Email is required"
        })}
      ></input>
      {errors?.email && (
        <div className={styles.errorBlock}>
         
            <span>
              <b>{errors.email.message}</b>
            </span>
        
        </div>
      )}
      <label className={styles.label} htmlFor="password" >Password</label>
      <input
        placeholder="Password"
        id="password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "The password must be at least 8 characters long",
          }
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
          marginTop: '10px',
          ":hover": { backgroundColor: "#4b28fa" },
        }}
      >
        Sign In
      </Button>
    </form> : <ProgressBar/>
    }
    </>
  );
};

export default SignIn;