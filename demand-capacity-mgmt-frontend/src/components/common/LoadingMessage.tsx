import React, { useState, useEffect } from 'react';
import { BounceLoader } from 'react-spinners';

const LoadingMessage = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [loaderColor, setLoaderColor] = useState('#ffa600'); // Initial color

  const loadingPhrases = [
    'Loading...',
    'Please wait...',
    'Fetching data...',
    'Almost there...',
    'Hold on a moment...',
  ];

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
    }, 5000); // Change the phrase every 2 seconds (adjust as needed)

    const colorInterval = setInterval(() => {
      // Define your two colors here
      const color1 = '#ffa600'; // First color
      const color2 = '#b3cb2d'; // Second color

      setLoaderColor((prevColor) => (prevColor === color1 ? color2 : color1));
    }, 1125); // Change color every 1.2 seconds (adjust as needed)

    return () => {
      clearInterval(phraseInterval); // Cleanup the interval for phrase changes on component unmount
      clearInterval(colorInterval); // Cleanup the interval for color changes on component unmount
    };
  }, []);

  return (
    <div className="text-center">
      <center>
        <BounceLoader color={loaderColor} />
      </center>
      <p className="loading-text">{loadingPhrases[currentPhraseIndex]}</p>
    </div>
  );
};

export default LoadingMessage;
