import React, { useState, useEffect, useContext } from "react";
import {Navbar, Image} from 'react-bootstrap/';
import axios from "axios";
import { ThemeContext } from "./Context";

interface TopNavBarProps {
  title: string;
 currWeather: string;
 currTemp: string;
}


const TopNavBar: React.FC<TopNavBarProps> = ({title, currTemp, currWeather}) => {
  const theme = useContext(ThemeContext)

return (
<div className={theme}>
  <Navbar fixed="top" className={`top-nav`}>
    <Image src="img/pgLogo.png" style={{height: '6vh', width: 'auto'}}/>
    {title}
    <div style={{display: "inline-block"}}>
    <Image src={currWeather} style={{height: '6vh', width: 'auto'}}/>
    <span style={{fontSize: '15px'}}>{currTemp}° F</span>
    </div>
  </Navbar>
  </div>

)

}

export default TopNavBar;