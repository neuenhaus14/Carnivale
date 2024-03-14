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
            href='/homepage'
            className='d-flex flex-row align-items-center'
          >
            <Image
              alt=''
              src='img/pgLogo.png'
              className='d-inline-block align-top'
              style={{ height: '6vh', width: 'auto' }}
            />{' '}
            <h2 className='mb-0 text-light'>Pardi Gras</h2>
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
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
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
