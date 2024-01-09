import React from 'react';
import {createRoot} from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
// import { REDIRECT_URL } from '../server/config';
// Import our custom CSS
import './styles/styles.scss';

import App from './Components/App'

//set the container as the element with the id app
const container = document.getElementById('app');
//set the root to be the invocation of createRoot on that element(div id=app)
const root = createRoot(container);

//Use React .render method on the root to pass in the component we want to render (parent aka APP)
root.render(
  <Auth0Provider
  domain={'https://dev-5in7n2lpfqf5vb2v.us.auth0.com'}
  clientId={'PPONBY54kyOaNBUlFbs1geQzPVOayaH5'}
  authorizationParams={{
    redirect_uri: `http://localhost:4000/homepage`,
  }}
>
  <App />
</Auth0Provider>
);