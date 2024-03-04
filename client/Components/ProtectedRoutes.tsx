import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoutes = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const redirectToLogin = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect();
      }
    };

    redirectToLogin();
  }, [isAuthenticated, loginWithRedirect]);

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return null;
  }
};

export default ProtectedRoutes;
