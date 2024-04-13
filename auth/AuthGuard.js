import { useState } from "react";
import LoginForm from "./LoginForm";

const AuthGuard = ({ children, onLoggedIn }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const loginSuccessful = (user) => {
    onLoggedIn(user);
    setLoggedIn(true);
  };

  return loggedIn ? children : <LoginForm onLoginSuccessful={loginSuccessful} />;
};

export default AuthGuard;
