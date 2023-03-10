import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import formImage from "../images/formImage.avif";
import ProgressBar from "../Components/ProgressBar";
import Button from "@mui/material/Button";
import styles from "./forms.module.scss";
import { CircularProgress } from "@mui/material";

const SignUp = () => {
  const [userPhoto, setUserPhoto] = React.useState<File>();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  type Inputs = {
    userName: string,
    email: string,
    password: string
  }

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<Inputs>({
    mode: "onBlur",
  });

  const registration: SubmitHandler<Inputs> = async (data, e) => {
    e?.preventDefault();
    try {
      const userCredendial = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setLoading(true);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.userName });
      }
      if (userPhoto != null) {
        const userPhotoRef = ref(
          storage,
          `usersPhotos/${userCredendial.user.uid}`
        );
  
        const uploadPhoto = await uploadBytes(userPhotoRef, userPhoto);
  
        const userPhotoURL = await getDownloadURL(uploadPhoto.ref);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: userPhotoURL });
        }
      }
  
      setDoc(doc(db, "users", userCredendial.user.uid), {
        uid: userCredendial.user.uid,
        displayName: data.userName,
        email: data.email,
        photoURL: auth.currentUser?.photoURL,
        onlineState: true,
        currentChatID: "",
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
          <form onSubmit={handleSubmit(registration)}>
            <h1>Sign Up</h1>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              placeholder="Username"
              id="username"
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 5,
                  message: "The username must be at least 5 characters long",
                },
                maxLength: {
                  value: 20,
                  message:
                    "The username must be no more than 20 characters long",
                },
              })}
            ></input>
            {errors?.userName && (
              <div className={styles.errorBlock}>
                <span>
                  <b>{errors.userName.message}</b>
                </span>
              </div>
            )}
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
            <div className={styles.avatarInput}>
              <IconButton
                sx={{ color: "#333" }}
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files != null) {
                      setUserPhoto(e.target.files[0]);
                    }
                  }}
                />
                <ImageIcon sx={{ color: "#4b28fa" }} />
              </IconButton>
              <span>Choose avatar image</span>
            </div>
            <Button
              type="submit"
              disabled={!isValid}
              variant="contained"
              sx={{
                height: "50px",
                backgroundColor: "#4b28fa",
                ":hover": { backgroundColor: "#4b28fa" },
              }}
            >
              Sign Up
            </Button>
            <div className={styles.already}>
              <span>Do you have an account already?</span>
              <Link to="/">Sign In</Link>
            </div>
          </form>
        </>
      ) : (
        <ProgressBar />
      )}
    </>
  );
};

export default SignUp;
