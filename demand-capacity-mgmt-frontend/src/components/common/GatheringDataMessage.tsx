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
import { GridLoader } from 'react-spinners';

const GatheringDataMessage = () => {
  const [loaderColor, setLoaderColor] = useState('#ffa600'); // Initial color
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    const colorInterval = setInterval(() => {
      // Define your two colors here
      const color1 = '#ffa600'; // First color
      const color2 = '#b3cb2d'; // Second color

      setLoaderColor((prevColor) => (prevColor === color1 ? color2 : color1));
    }, 1125); // Change color every 1.2 seconds (adjust as needed)

    const loadingDotsInterval = setInterval(() => {
      setLoadingDots((prevDots) => {
        if (prevDots.length === 3) {
          // Reset the dots to a single dot after three dots
          return '.';
        } else {
          // Add a dot to the existing dots
          return prevDots + '.';
        }
      });
    }, 500); // Change dots every 0.5 seconds (adjust as needed)

    return () => {
      clearInterval(colorInterval); // Cleanup the color interval on component unmount
      clearInterval(loadingDotsInterval); // Cleanup the loading dots interval on component unmount
    };
  }, []);

  return (
    <div className="text-center">
      <center>
        <GridLoader color={loaderColor} />
      </center>
      <p className="loading-text">Gathering data{loadingDots}</p>
    </div>
  );
};

export default GatheringDataMessage;
