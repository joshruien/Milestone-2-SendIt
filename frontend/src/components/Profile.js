import React, { Fragment } from "react"
import { useAuth0 } from "../react-auth0-spa"
import "../App.css";
import { Image, Button } from "react-bootstrap"

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <br></br>
        <Image src={user.picture} alt="Profile" width="100" height="100" roundedCircle/>
        <hr/>
        <Button variant="link">Edit Profile</Button>
        <div style={{borderStyle: 'groove', paddingTop: '30px', paddingBottom: '30px', width:'50%', margin: 'auto'}}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Contact Number: </p>
          </div>
        </div>
    </Fragment>
  );
};

export default Profile;