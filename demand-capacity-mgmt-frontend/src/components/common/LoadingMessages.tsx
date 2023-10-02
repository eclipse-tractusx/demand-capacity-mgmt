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
import React, { useState, useEffect } from 'react';
import { BounceLoader, GridLoader } from 'react-spinners';

const useLoader = (initialColor: string) => {
  const [color, setColor] = useState<string>(initialColor);
  const [loadingDots, setLoadingDots] = useState<string>('');

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColor((prevColor) => (prevColor === '#ffa600' ? '#b3cb2d' : '#ffa600'));
    }, 1125);

    const loadingDotsInterval = setInterval(() => {
      setLoadingDots((prevDots) => (prevDots.length === 3 ? '.' : prevDots + '.'));
    }, 500);

    return () => {
      clearInterval(colorInterval);
      clearInterval(loadingDotsInterval);
    };
  }, []);

  return { color, loadingDots };
};

interface CustomLoaderProps {
  message: string;
}

const LoadingCustomMessage: React.FC<CustomLoaderProps> = ({ message }) => {
  const { color, loadingDots } = useLoader('#ffa600');

  return (
    <div className="text-center">
      <center>
        <BounceLoader color={color} />
      </center>
      <p className="loading-text">{message}{loadingDots}</p>
    </div>
  );
};

const LoadingGatheringDataMessage = () => {
  const { color, loadingDots } = useLoader('#ffa600');

  return (
    <div className="text-center">
      <center>
        <GridLoader color={color} />
      </center>
      <p className="loading-text">Gathering data{loadingDots}</p>
    </div>
  );
};

const LoadingMessage = () => {
  const { color, loadingDots } = useLoader('#ffa600');

  const loadingPhrases = [
    'Loading',
    'Please wait',
    'Fetching items',
    'Syncing objects',
    'Almost there',
    'Hold on a moment',
    'Preparing data',
    'Calculating results',
    'Validating outputs',
    'Loading assets',
    'Optimizing performance',
  ];


  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length);
    }, 4000); // Change the phrase every 3 seconds

    return () => {
      clearInterval(phraseInterval);
    };
  }, [loadingPhrases.length]);

  return (
    <>
      <br />
      <div className="text-center">
        <center>
          <BounceLoader color={color} />
        </center>
        <p className="loading-text">{loadingPhrases[currentPhraseIndex]}{loadingDots}</p>
      </div>
    </>
  );
};

export { LoadingGatheringDataMessage, LoadingMessage, LoadingCustomMessage };
