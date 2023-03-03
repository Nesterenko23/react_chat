import React from 'react';
import { Routes, Route } from 'react-router-dom'
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Home from './Pages/HomePage';
import { setChangedWidth } from './Redux/Slices/screenParamsSlice';
import { useSelector, useDispatch } from 'react-redux';
import styles from './app.module.scss'
import PageNotFound from './Components/PageNotFound';
function App() {

  return (
    <div className={styles.wrapper}>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
