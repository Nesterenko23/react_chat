import React from "react";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import styles from "./chatList.module.scss";
import { db } from "../../firebase";
import {
  onSnapshot,
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setChatUser } from "../../Redux/Slices/chatUserSlice";
import ProgressBar from "../ProgressBar";
const ChatList = ({ setRespValue }) => {
  const currentUser = useSelector((state) => state.currentUser.currentUser);
  const [chatUsers, setChatUsers] = React.useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (currentUser.uid) {
      setLoading(true);
      const unsub = onSnapshot(
        query(
          collection(db, "users", currentUser.uid, "chatUsers"),
          orderBy("lastSendTime", "desc")
        ),
        (snapshot) => {
          setChatUsers(snapshot.docs.map((doc) => doc.data()));
          setLoading(false);
        }
      );
      return unsub;
    }
  }, [currentUser]);

  const selectChatUser = async (el) => {
    const chatUserState = await getDoc(doc(db, "users", el.uid));
    dispatch(
      setChatUser({
        uid: el.uid,
        displayName: el.displayName,
        photoURL: el.photoURL,
        onlineStatus: chatUserState.data().onlineState
      })
    );

    const combainedUID = currentUser.uid > el.uid 
    ? currentUser.uid + el.uid
    : el.uid + currentUser.uid

    await updateDoc(doc(db, "users", currentUser.uid), {
      currentChatID: combainedUID
    })
    await updateDoc(doc(db, "users", currentUser.uid, "chatUsers", el.uid), {
      lastMessages: []
    })
    // await updateDoc(doc(db, "users", el.uid), {
    //   currentChatID: currentUser.uid + el.uid
    // })

    if (window.outerWidth <= 1100) {
      setRespValue("open");
    }
  };

  return (
    <ul className={styles.chatsList}>
      {loading == false ? (
        chatUsers.map((el) => (
          <li
            key={el.uid}
            className={styles.chatUser}
            onClick={() => selectChatUser(el)}
          >
            <Avatar src={el.photoURL} sx={{ height: "48px", width: "48px" }} />
            <div className={styles.chatUserData}>
              <span className={styles.userName}>
                <b>{el.displayName}</b>
              </span>
              <span className={styles.lastMessage}>{el.lastMessage}</span>
            </div>
            <div className={styles.chatUserDetails}>
              <span className={styles.time}>
                {el.lastSendTime?.toDate().toLocaleTimeString().slice(0, 5)}
              </span>
              <Badge
                badgeContent={el.lastMessages?.length}
                sx={{
                  alignSelf: "center",
                  color: 'white',
                  "& .MuiBadge-badge": {
                    backgroundColor: "rgba(150,93,233,1)",
                  },
                }}
              ></Badge>
            </div>
          </li>
        ))
      ) : (
        <ProgressBar />
      )}
    </ul>
  );
};

export default ChatList;
