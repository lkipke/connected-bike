import React, { useEffect, useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import {
  deleteUserCookie,
  getUserCookie,
  setUserCookie,
} from "../services/cookieService";

const CLIENT_ID =
  "820607331638-nlfao9asjhioq5uvtumes90brq5akpd0.apps.googleusercontent.com";

const SCOPE = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.activity.write",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.body.write",
].join(" ");

export const AccountControls = ({ onUserLoaded }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (response) => {
    if (response.wc.access_token) {
      onUserLoaded({
        ...response.profileObj,
        haslogin: true,
        accessToken: response.wc.access_token,
      });
      setLoggedIn(true);
    }

    setUserCookie({
      ...response.profileObj,
      accessToken: response.wc.access_token,
    });
  };

  const handleLogout = () => {
    onUserLoaded({ haslogin: false, accessToken: "" });
    deleteUserCookie();
    setLoggedIn(false);
  };

  const handleFailure = (response) => console.log(response);

  // checks for user info in cookies
  useEffect(() => {
    const userCookie = getUserCookie();

    if (userCookie.haslogin) {
      onUserLoaded({
        ...userCookie,
      });
      setLoggedIn(true);
    }
  }, [onUserLoaded]);

  if (loggedIn) {
    return (
      <GoogleLogout
        clientId={CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={handleLogout}
        onFailure={handleFailure}
      />
    );
  }

  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Login"
      onSuccess={handleLogin}
      onFailure={handleFailure}
      cookiePolicy="single_host_origin"
      responseType="code,token"
      scope={SCOPE}
    />
  );
};
