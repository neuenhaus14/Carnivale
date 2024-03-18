import React, { useContext } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap/';

import { MdShare } from '@react-icons/all-files/md/MdShare';
import { FaMapMarkedAlt } from '@react-icons/all-files/fa/FaMapMarkedAlt';
import { IoHomeOutline } from '@react-icons/all-files/io5/IoHomeOutline';
import { IoPeople } from '@react-icons/all-files/io5/IoPeople';
import { ThemeContext } from './Context';

const NavBar = () => {
  const navigate = useNavigate();
  const handleNavigation = (path: To) => {
    navigate(path);
  };
  const theme = useContext(ThemeContext);

  return (
    <div className={theme}>
      <Navbar fixed='bottom' className='bottom-nav'>
        <Button
          variant='primary'
          className='bottom-nav-button rounded-circle'
          type='button'
          id='homeButton'
          onClick={() => handleNavigation('/homepage')}
        >
          <IoHomeOutline />
        </Button>

        <Button
          className='bottom-nav-button rounded-circle'
          type='button'
          id='mapButton'
          onClick={() => handleNavigation('/mappage')}
        >
          <FaMapMarkedAlt />
        </Button>

        <Button
          className='bottom-nav-button rounded-circle'
          type='button'
          id='feedButton'
          onClick={() => handleNavigation('/feedpage')}
        >
          <MdShare />
        </Button>

        <Button
          className='bottom-nav-button rounded-circle'
          type='button'
          id='userButton'
          onClick={() => handleNavigation('/userpage')}
        >
          <IoPeople />
        </Button>
      </Navbar>
    </div>
  );
};
export default NavBar;
