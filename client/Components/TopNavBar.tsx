import React, { useState, useEffect, useContext } from "react";
import {Navbar, Image} from 'react-bootstrap/';
import axios from "axios";
import { ThemeContext } from "./Context";

interface TopNavBarProps {
  title: string;
}


const TopNavBar: React.FC<TopNavBarProps> = ({title}) => {
  const [location, setLocation] = useState('');
  const [currWeather, setCurrWeather] = useState("");
  const [currTemp, setCurrTemp] = useState("");
  const theme = useContext(ThemeContext)

  const getWeather = async (pos: any) => {
    const crd = pos.coords;
    try {
      const { data } = await axios.get(`/api/weather/${crd.latitude},${crd.longitude}`);
      setCurrWeather(data.current.condition.icon);
      setCurrTemp(data.current.temp_f);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);


  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(getWeather)
    } else {
      console.log("Geolocation is not supported by this browser")
      return null
    }
  }


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