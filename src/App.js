import React, {Suspense} from 'react';
import { Routes, Route } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress';
import styles from './app.module.scss'
function App() {

  const SignIn = React.lazy(
    () => import(/* webpackChunkName: "SignInPage" */ "./Pages/SignIn")
  );
  const SignUp = React.lazy(
    () => import(/* webpackChunkName: "SignUpPage" */ "./Pages/SignUp")
  );
  const Home = React.lazy(
    () => import(/* webpackChunkName: "HomePage" */ "./Pages/HomePage")
  );
  const PageNotFound = React.lazy(
    () => import(/* webpackChunkName: "PageNotFound" */ "./Components/PageNotFound")
  );

  return (
    <div className={styles.wrapper}>
      <Suspense
        fallback = {
          <div style={{width: '100%'}}><LinearProgress sx={{width: '100%'}} color="secondary"/></div>
        }
      >
        <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      </Suspense>
      
    </div>
  );
}

export default App;
