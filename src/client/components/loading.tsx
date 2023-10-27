import React from 'react';
import loadingAnimation from '../lottie/loading-animation.json';
import Lottie from 'lottie-react';

const Loading: React.FC = () => {

  
  return (
    <div className='loading-screen'>
      <Lottie animationData={loadingAnimation} />
      <p>Shark data capture in progress</p>
    </div>
  );
};

export default Loading;
