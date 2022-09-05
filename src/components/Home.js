import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

const Home = () => {

  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, []); 


  return (

  <div className="bootstrap-wrapper">
    <div className="big-wrapper light">
      <div className="showcase-area">
        <div className="container">

          <div className="left">
            <div className="big-title">
              <h1 className="big-title"><b> Visualization and Analysis</b> 📈!</h1>
              <h2>a WEVIOO intern solution for visualization and analysis of documents 🔍 .. </h2>    
            </div>
            <p className="text">
            matching required words with each document highlighted words ..
            </p>                      
            <div className="cta">
              <a className="boutton" href="https://www.wevioo.com/fr">About Wevioo</a>
            </div>
          </div>

          <div className="right">
            <img className="illustration" src="https://i.imgur.com/s4XbfUD.png"/>
          </div>
          
        </div>
      </div>
    </div>
  </div>  
  );
};

export default Home;