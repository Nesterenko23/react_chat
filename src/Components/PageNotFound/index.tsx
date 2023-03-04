import React from 'react'
import pageNotFoundImage from '../../images/pageNotFound.jpg'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{margin: '0px', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <img style={{height: 'auto', width: '300px', marginBottom: '50px'}} src={pageNotFoundImage}></img>
        <div><h2>404</h2></div>
        <div><h2>Page Not Found</h2></div>
        <Button
        variant="contained"
        sx={{
          height: "50px",
          width: '250px',
          marginTop: '30px',
          backgroundColor: "#4b28fa",
          ":hover": { backgroundColor: "#4b28fa" },
        }}
        onClick = {() => navigate("/home") }
      >
        Home
      </Button>
    </div>
  )
}

export default PageNotFound