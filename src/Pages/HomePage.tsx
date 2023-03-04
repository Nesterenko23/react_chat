import React from "react";
import SideBar from "../Components/SideBar";
import ChatBar from "../Components/ChatBar";
import { setCurrentUser } from "../Redux/Slices/currentUserSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useAppDispatch } from "../Redux/hooks";
const Home = () => {
  const [respValue, setRespValue] = React.useState("");
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setCurrentUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        );
      } else {
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <SideBar respValue={respValue} setRespValue={setRespValue} />
      <ChatBar respValue={respValue} setRespValue={setRespValue} />
    </div>
  );
};

export default Home;
