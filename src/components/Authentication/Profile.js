import React from "react";
import AuthService from "../../services/auth.service";

// profile component
const Profile = () => {

  const currentUser = AuthService.getCurrentUser();
  
  return (
    <div className="container">
      <div className="card profile">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
        {console.log(currentUser.username)}
        <ul className="list-group list-group-flush ">
        <br/>
          <p>
            <strong>E-mail : </strong> {currentUser.email}
          </p>
          <p>
            <strong>Authorities : </strong> {currentUser.roles && currentUser.roles.map((role, index) => <i key={index}>{role}</i>)}
          </p>
        </ul>
      </div> 
    </div>
  );
};

export default Profile;