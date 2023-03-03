import React from "react";
import styles from "./sideBar.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ChatList from "../ChatList";
import SearchList from "../SearchList";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import LogoutIcon from '@mui/icons-material/Logout';
import { auth, db } from "../../firebase";
import { Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";


const SideBar = ({respValue, setRespValue}) => {

  const logOut = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      onlineState: false
    })  
    signOut(auth)
    navigate("/")
  }

  const [searchValue, setSearchValue] = React.useState("");
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser.currentUser)

  return (
    <div className={styles.wrapper} style = {{display: respValue == "open" && "none"}}>
      <div className={styles.searchBar}>
        <Avatar src={currentUser.photoURL}/>
        <div className={styles.inputBlock}>
          <SearchIcon sx={{color: "rgba(0, 0, 0, 0.42)"}}/>
          <input placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></input>
          {searchValue != "" && <CloseIcon sx={{cursor: "pointer", color: "rgba(0, 0, 0, 0.42)"}} onClick={() => setSearchValue("")}/>}
        </div>
        <IconButton sx={{marginLeft: '5px'}} onClick={() => logOut()}>
          <LogoutIcon/>
        </IconButton>

        
      </div>
      { searchValue == "" ? <ChatList setRespValue = {setRespValue}/> : <SearchList searchValue={searchValue} setSearchValue={setSearchValue}/> }
    </div>
  );
};

export default SideBar;
