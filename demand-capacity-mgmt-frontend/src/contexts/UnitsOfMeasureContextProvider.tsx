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

import React, { createContext, useState, useEffect } from 'react';
import Api from "../util/Api";


export interface UnitMeasure {
  id: string
  dimension: string
  unCode: string
  description: string
  descriptionGerman: string
  unSymbol: string
  cxSymbol: string
}

interface UnitsOfMeasureContextData {
  unitsofmeasure: UnitMeasure[];
}

export const UnitsofMeasureContext = createContext<UnitsOfMeasureContextData | undefined>(undefined);

const UnitsofMeasureContextContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {

  const [unitsofmeasure, setUnitsofMeasure] = useState<UnitMeasure[]>([]);

  useEffect(() => {
    const fetchUnitsofMeasure = async () => {
      try {
        const response = await Api.get('/unitmeasure');
        const result: UnitMeasure[] = response.data;
        setUnitsofMeasure(result);
      } catch (error) {
        console.error('Error fetching units of measure:', error);
      }
    };
  
    fetchUnitsofMeasure();
  }, []);
  
  


  return (
    <UnitsofMeasureContext.Provider value={{ unitsofmeasure}}>
      {props.children}
    </UnitsofMeasureContext.Provider>
  );
};

export default UnitsofMeasureContextContextProvider;
