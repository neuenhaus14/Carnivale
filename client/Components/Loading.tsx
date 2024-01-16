import React from 'react';
function Loading() {
  return (
    <div className="loader-container">
      <div className="loader">Load me something mister!
        <img
        width='100%'
        height='auto'
        src={'img/handsinair.gif'}
        alt="Loading..."/>
        </div>
    </div>
  );
}

export default Loading;
