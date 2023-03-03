import React from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import styles from "./chatInputArea.module.scss";
import EmojiPicker from "emoji-picker-react";
import Picker from "emoji-picker-react";
import { CircularProgress } from "@mui/material";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useSelector } from "react-redux";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const ChatInputArea = ({ messageEndRef }) => {
  const onEmojiClick = (event) => {
    setChatMessage((prev) => prev + event.emoji);
    setShowPicker(false);
  };

  const currentUser = useSelector((state) => state.currentUser.currentUser);
  const chatUser = useSelector((state) => state.chatUser.chatUser);
  const [chatImage, setChatImage] = React.useState(null);
  const [chatMessage, setChatMessage] = React.useState("");
  const [showPicker, setShowPicker] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const sendMessage = async () => {
    setLoading(true);
    try {
      if (currentUser && chatUser) {
        let chatImageURL = "";
        const combainedName =
          currentUser.uid + chatUser.uid + new Date().getMilliseconds();
        const chatUserData = await getDoc(doc(db, "users", chatUser.uid));
        const currentChatID = chatUserData.data().currentChatID;
        const currentUserData = await getDoc(doc(db, "users", currentUser.uid));
        const currentUserChatID = currentUserData.data().currentChatID;

        if (chatImage) {
          const userPhotoRef = ref(storage, `chatsImages/${combainedName}`);

          const uploadPhoto = await uploadBytes(userPhotoRef, chatImage);

          const userPhotoURL = await getDownloadURL(uploadPhoto.ref);

          chatImageURL = userPhotoURL;
        }

        await setDoc(
          doc(
            db,
            "users",
            currentUser.uid,
            "chatUsers",
            chatUser.uid,
            "messages",
            combainedName
          ),
          {
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            messageID: combainedName,
            message: chatImageURL == "" ? chatMessage : chatImageURL,
            type: chatImageURL == "" ? "text" : "image",
            likedBy: [],
            timestamp: serverTimestamp(),
          }
        );
        await updateDoc(
          doc(db, "users", currentUser.uid, "chatUsers", chatUser.uid),
          {
            lastMessage:
              chatImageURL == ""
                ? chatMessage.length <= 35
                  ? chatMessage
                  : chatMessage.slice(0, 35) + "..."
                : "Photo",
            lastSendTime: serverTimestamp(),
          }
        );

        await setDoc(
          doc(
            db,
            "users",
            chatUser.uid,
            "chatUsers",
            currentUser.uid,
            "messages",
            combainedName
          ),
          {
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            messageID: combainedName,
            message: chatImageURL == "" ? chatMessage : chatImageURL,
            type: chatImageURL == "" ? "text" : "image",
            likedBy: [],
            timestamp: serverTimestamp(),
          }
        );

        await updateDoc(
          doc(db, "users", chatUser.uid, "chatUsers", currentUser.uid),
          {
            lastMessages:
              currentChatID != currentUserChatID
                ? arrayUnion(
                    chatImageURL == ""
                      ? chatMessage + new Date().getSeconds()
                      : chatImageURL + new Date().getSeconds()
                  )
                : [],
            lastMessage:
              chatImageURL == ""
                ? chatMessage.length <= 35
                  ? chatMessage
                  : chatMessage.slice(0, 35) + "..."
                : "Photo",
            lastSendTime: serverTimestamp(),
          }
        );
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
      chatMessage != "" && setChatMessage("");
      chatImage != null && setChatImage(null);
      messageEndRef.current.scrollIntoView();
    }
  };

  return (
    <div className={styles.inputArea}>
      <IconButton sx={{ color: "rgba(99,88,238,1)" }}>
        <InsertEmoticonIcon onClick={() => setShowPicker((val) => !val)} />
      </IconButton>
      {showPicker && (
        <div style={{ position: "absolute", top: "25%", left: "30%" }}>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <input
        placeholder="Message"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      ></input>
      <IconButton
        sx={{ color: "rgba(99,88,238,1)" }}
        aria-label="upload picture"
        component="label"
      >
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={(e) => {
            setChatImage(e.target.files[0]);
          }}
        />
        <ImageIcon />
      </IconButton>
      <div
        style={{
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress size={30} sx={{ color: "rgba(99,88,238,1)" }} />
        ) : (
          <IconButton
            sx={{ color: "rgba(99,88,238,1)" }}
            onClick={() => {
              sendMessage();
            }}
          >
            <SendIcon sx={{ color: "rgba(99,88,238,1)" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default ChatInputArea;
