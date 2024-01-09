import React from "react";
import {Navbar, Image} from 'react-bootstrap/';


interface TopNavBarProps {
  title: string;
}


const TopNavBar: React.FC<TopNavBarProps> = ({title}) => {

return (
  <Navbar fixed="top" className="top-nav">
    <Image src="img/pgLogo.png" style={{height: '6vh', width: 'auto'}}/>
    {title}
    {/* <Image src="img/pgLogo.png" style={{height: '6vh', width: 'auto'}}/> */}
  </Navbar>
)

}

export default TopNavBar;