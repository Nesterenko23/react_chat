import { Avatar } from "@mui/material";
import React from "react";
import Message from "../Message";
import styles from "./chatBar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../../firebase";
import {
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import ChatInputArea from "../ChatInputArea";
import ProgressBar from "../ProgressBar";
import { useAppSelector } from "../../Redux/hooks";
import { currentUserSelector } from "../../Redux/Slices/currentUserSlice";
interface ChatBarProps {
  respValue: string,
  setRespValue: (respValue: string) => void;
}
const ChatBar = ({ respValue, setRespValue }: ChatBarProps) => {
  type MessageType = {
    id: string,
    messages: DocumentData
  }
  const dispatch = useDispatch();
  const chatUser = useAppSelector((state) => state.chatUser.chatUser);
  const currentUser = useAppSelector(currentUserSelector);
  const [allMessages, setAllMessages] = React.useState<MessageType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const messageEndRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (chatUser.uid && currentUser.uid) {
      setLoading(true);
      const unsub = onSnapshot(
        query(
          collection(
            db,
            "users",
            currentUser.uid,
            "chatUsers",
            chatUser.uid,
            "messages"
          ),
          orderBy("timestamp")
        ),
        (snapshot) => {
          setAllMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              messages: doc.data(),
            }))
          );
          setLoading(false);
        }
      );

      return unsub;
    }
  }, [chatUser.uid]);

  return (
    <div
      className={styles.wrapper}
      // style={{ display: respValue == "open" && ? "inline-block" : "none" }}
    >
      <div className={styles.topBar}>
        {respValue == "open" && (
          <div style={{ marginRight: "10px" }}>
            <ArrowBackIcon
              onClick={async () => {
                setRespValue("");
                await updateDoc(doc(db, "users", currentUser.uid), {
                  currentChatID: "",
                });
              }}
            />
          </div>
        )}
        <Avatar
          src={chatUser.photoURL}
          sx={{ height: "40px", width: "40px" }}
        />
        <div className={styles.chatUserInfo}>
          <span className={styles.userName}>{chatUser.displayName}</span>
          <span className={styles.status}>
            {chatUser.onlineStatus ? "online" : "offline"}
          </span>
        </div>
        <div className={styles.icons}>
          <SearchIcon />
          <LocalPhoneIcon />
          <MoreVertIcon />
        </div>
      </div>
      {chatUser.uid ? (
        <div className={styles.viewBlock}>
          <div className={styles.messageArea}>
            {loading == false ? (
              allMessages.map((mObj) => (
                <Message
                  key={mObj.id}
                  message={mObj.messages.message}
                  obj={mObj}
                />
              ))
            ) : (
              <ProgressBar />
            )}
            <div ref={messageEndRef}></div>
          </div>

          <ChatInputArea messageEndRef={messageEndRef} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <h3>Select someone for start conversation</h3>
        </div>
      )}
    </div>
  );
};

export default ChatBar;
