/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */
import { useState, useEffect } from 'react';
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
    }, 2000); // Change the phrase every 2 seconds (adjust as needed)

    const colorInterval = setInterval(() => {
      // Define your two colors here
      const color1 = '#ffa600'; // First color
      const color2 = '#b3cb2d'; // Second color

      setLoaderColor((prevColor) => (prevColor === color1 ? color2 : color1));
    }, 1125);

    return () => {
      clearInterval(phraseInterval); // Cleanup the interval for phrase changes on component unmount
      clearInterval(colorInterval); // Cleanup the interval for color changes on component unmount
    };
  });

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
