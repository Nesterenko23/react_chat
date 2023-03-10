import React from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, setDoc, doc, getDoc, serverTimestamp, DocumentData } from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import styles from "./searchList.module.scss";
import { useSelector } from "react-redux";
import { currentUserSelector, CurrentUserType } from "../../Redux/Slices/currentUserSlice";
import { useAppSelector } from "../../Redux/hooks";
type SearchBarProps = {
  searchValue: string,
  setSearchValue: (searchValue: string) => void;
}
const SearchList = ({ searchValue, setSearchValue }: SearchBarProps) => {
  const [allUsers, setAllUsers] = React.useState<DocumentData[]>([]);
  const currentUser = useAppSelector(currentUserSelector)

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setAllUsers(snapshot.docs.map((doc) => doc.data()));
    });

    return unsub;
  }, []);

  const addChatUser = async (chatUser: DocumentData) => {

    const chatUserRef = await getDoc(doc(db, "users", currentUser.uid, "chatUsers", chatUser.uid))
    const data = chatUserRef.data()
    if (!data) {
      await setDoc(doc(db, "users", currentUser.uid, "chatUsers", chatUser.uid), {
        uid: chatUser.uid,
        displayName: chatUser.displayName,
        email: chatUser.email,
        photoURL: chatUser.photoURL,
        lastMessage: "",
        lastSendTime: serverTimestamp()
      });
      await setDoc(doc(db, "users", chatUser.uid, "chatUsers", currentUser.uid), {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        lastMessage: "",
        lastSendTime: serverTimestamp()
      });      
    }

    setSearchValue("")

  }

  return (
    <div className={styles.searchList}>
      {allUsers
        .filter((item) =>
          item.displayName?.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((item) => {
          return (
            <li key={item.uid} className={styles.chatUser} onClick = {() => addChatUser(item)}>
              <Avatar src={item.photoURL} sx={{ height: "48px", width: "48px" }} />
              <div className={styles.chatUserData}>
                <span className={styles.userName}>
                  <b>{item.displayName}</b>
                </span>
              </div>
            </li>
          );
        })}
    </div>
  );
};

export default SearchList;
