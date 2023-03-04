import React from "react";
import styles from "./message.module.scss";
import { useSelector } from "react-redux";
import { updateDoc, doc, arrayUnion, arrayRemove, DocumentData } from "firebase/firestore";
import { db } from "../../firebase";
import { currentUserSelector } from "../../Redux/Slices/currentUserSlice";
import { useAppSelector } from "../../Redux/hooks";

type ObjType = {
  id: string,
  messages: DocumentData
}

interface MessageProps {
  message: string,
  obj: ObjType
}
const Message = ({ message, obj }: MessageProps) => {
  const currentUser = useAppSelector(currentUserSelector);
  const chatUser = useAppSelector((state) => state.chatUser.chatUser);

  const likeMessage = async () => {
    if (obj.messages.likedBy.includes(currentUser.uid)) {
      await updateDoc(
        doc(
          db,
          "users",
          currentUser.uid,
          "chatUsers",
          chatUser.uid,
          "messages",
          obj.messages.messageID
        ),
        {
          likedBy: arrayRemove(currentUser.uid),
        }
      );
      await updateDoc(
        doc(
          db,
          "users",
          chatUser.uid,
          "chatUsers",
          currentUser.uid,
          "messages",
          obj.messages.messageID
        ),
        {
          likedBy: arrayRemove(currentUser.uid),
        }
      );
    } else {
      await updateDoc(
        doc(
          db,
          "users",
          currentUser.uid,
          "chatUsers",
          chatUser.uid,
          "messages",
          obj.messages.messageID
        ),
        {
          likedBy: arrayUnion(currentUser.uid),
        }
      );
      await updateDoc(
        doc(
          db,
          "users",
          chatUser.uid,
          "chatUsers",
          currentUser.uid,
          "messages",
          obj.messages.messageID
        ),
        {
          likedBy: arrayUnion(currentUser.uid),
        }
      );
    }
  };

  return (
    <div
      className={styles.message}
      style={{
        backgroundImage:
          obj.messages.uid == currentUser.uid
            ? "linear-gradient( 83.2deg,  rgba(150,93,233,1) 10.8%, rgba(99,88,238,1) 94.3% )"
            : "none",
        padding: obj.messages.type == "image" ? "0px 0px 10px 0px" : "10px",
        backgroundColor: obj.messages.uid == currentUser.uid ? "" : "white",
        borderRadius:
          obj.messages.uid == currentUser.uid
            ? "18px 18px 0 18px"
            : "18px 18px 18px 0px",
        color: obj.messages.uid == currentUser.uid ? "white" : "black",
        alignSelf:
          obj.messages.uid == currentUser.uid ? "flex-end" : "flex-start",
      }}
      onClick={() => likeMessage()}
    >
      {obj.messages.type == "image" ? (
        <img
          src={message}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px 10px 0px 0px",
          }}
        ></img>
      ) : (
        <span className={styles.textMessage}>{message}</span>
      )}

      <div className={styles.information}>
        {/* <span></span> */}
        {obj.messages.likedBy.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "5px",
            }}
          >
            <span>❤️</span>
            <span>
              <b>{obj.messages.likedBy.length}</b>
            </span>
          </div>
        )}
        <span style={{ marginRight: obj.messages.type == "image" ? "10px" : "0px" }}>
          {obj.messages.timestamp?.toDate().toLocaleTimeString().slice(0, 5)}
        </span>
      </div>
    </div>
  );
};

export default Message;
