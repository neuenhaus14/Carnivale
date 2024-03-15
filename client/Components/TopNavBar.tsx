import React, { useContext } from 'react';
import { Navbar, Image, Container, Nav } from 'react-bootstrap/';
import { ThemeContext } from './Context';
import { To, useNavigate } from 'react-router-dom';

interface TopNavBarProps {
  title: string;
  currWeather: string;
  currTemp: string;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  currTemp,
  currWeather,
}) => {
  const navigate = useNavigate();
  const handleNavigation = (path: To) => {
    navigate(path);
  };
  const theme = useContext(ThemeContext);

  return (
    <div className={theme}>
      {/* Mobile */}
      <Navbar
        fixed='top'
        className='top-nav d-flex d-lg-none d-xl-none d-xxl-none'
      >
        <Container>
          <Image
            className='nav-bar-brand-image'
            src='img/pgLogo.png'
            style={{ height: '6vh', width: 'auto' }}
          />
          {title}
          <div style={{ display: 'inline-block' }}>
            <Image src={currWeather} style={{ height: '6vh', width: 'auto' }} />
            <span style={{ fontSize: '15px' }}>{currTemp}° F</span>
          </div>
        </Container>
      </Navbar>

      {/* Desktop */}
      <Navbar
        fixed='top'
        className='top-nav d-none d-sm-none d-md-none d-lg-flex d-xl-flex d-xxl-flex'
      >
        <Container>
          <Navbar.Brand
            className='d-flex flex-row align-items-center'
          >
            <Image
              alt=''
              src='img/pgLogo.png'
              className='d-inline-block align-top nav-bar-brand-image'
              style={{ height: '6vh', width: 'auto' }}
            />{' '}
            <div className='nav-bar-brand-text ms-1'>Pardi Gras</div>
          </Navbar.Brand>
          <Nav className='m-auto'>
            <Nav.Link
              role='button'
              onClick={() => handleNavigation('/homepage')}
            >
              Home
            </Nav.Link>
            <Nav.Link role='button' onClick={() => handleNavigation('/mappage')}>Map</Nav.Link>
            <Nav.Link role='button' onClick={() => handleNavigation('/feedpage')}>Feed</Nav.Link>
            <Nav.Link role='button' onClick={() => handleNavigation('/userpage')}>User</Nav.Link>
            <Nav.Link role='button' onClick={() => handleNavigation('/eventpage')}>Live Music</Nav.Link>
            <Nav.Link role='button' onClick={() => handleNavigation('/parades')}>Parades</Nav.Link>
          </Nav>
          <div style={{ display: 'inline-block' }}>
            <Image src={currWeather} style={{ height: '6vh', width: 'auto' }} />
            <span style={{ fontSize: '15px' }}>{currTemp}° F</span>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopNavBar;
