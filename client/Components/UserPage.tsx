import React, { ReactPropTypes }from 'react';
import { useParams } from "react-router-dom";

const UserPage = ({ coolThing }: UserPageProps ) => {

  const { id } = useParams();

  return (
    <div>
      <h1>UserPage!!!</h1>
      <p>  { id } </p>
      <p> { coolThing } </p>
    </div>
  )
};

interface UserPageProps {
  coolThing: string
}

export default UserPage;