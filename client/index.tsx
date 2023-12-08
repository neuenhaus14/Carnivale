import React from 'react';
import {createRoot} from 'react-dom/client' 
// Import our custom CSS
import './styles/styles.scss';

import App from './Components/App'

//set the container as the element with the id app
const container = document.getElementById('app');
//set the root to be the invocation of createRoot on that element(div id=app)
const root = createRoot(container);

//Use React .render method on the root to pass in the component we want to render (parent aka APP)
root.render(
  <App />,
);