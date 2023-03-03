import React from 'react'
import SideBar from '../Components/SideBar';
import ChatBar from '../Components/ChatBar';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../Redux/Slices/currentUserSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
const Home = () => {
  const [respValue, setRespValue] = React.useState("");
  const dispatch = useDispatch();
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
    
      // const currentUserDoc = await getDoc(doc(db, "users", user.uid))

        if (user) {
         dispatch(setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
         }))
        } else {
        
        }
      });
      
  }, [])

  return (
    <div style={{display: 'flex', width: '100%'}}>
        <SideBar respValue = {respValue} setRespValue = {setRespValue}/>
        <ChatBar respValue = {respValue} setRespValue = {setRespValue}/>
    </div>
  )
}

export default Home