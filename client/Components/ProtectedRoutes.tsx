import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

  return (
    <div>
      <h1>ProtectedRoutes!</h1>
      <Outlet />
    </div>

  )

}

export default ProtectedRoutes;
