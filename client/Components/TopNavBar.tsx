import React from "react";
import Navbar from 'react-bootstrap/Navbar';

interface TopNavBarProps {
  title: string;
}


const TopNavBar: React.FC<TopNavBarProps> = ({title}) => {

return (
  <Navbar sticky="top" className="top-nav">
    {title}
  </Navbar>
)

}

export default TopNavBar;