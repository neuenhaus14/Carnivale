import React from 'react';
import { Image } from 'react-bootstrap';


function Loading() {
  return (
      <div id='loader-container'>
        <h5>Load me something mister!</h5>
        <Image
          src={
            'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1715006227/handsinair_oadi2y.gif'
          }
          alt='Loading...'
        />
      </div>
  );
}

export default Loading;
