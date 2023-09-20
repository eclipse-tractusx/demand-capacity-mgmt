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

import React, { useState } from 'react';
import { DemandProp } from '../../interfaces/demand_interfaces';

interface Demand {
  id: number;
  name: string;
}

interface SearchableDemandsProps {
  allDemands: DemandProp[] |null;
}

function SearchableDemands({ allDemands }: SearchableDemandsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemands, setSelectedDemands] = useState<DemandProp[]>([]);

  const handleDemandSelect = (demand: DemandProp) => {
    setSelectedDemands([...selectedDemands, demand]);
  };

  const filteredDemands = allDemands?.filter((demand) =>
  demand.materialDescriptionCustomer.toLowerCase().includes(searchQuery.toLowerCase())
) || [];

  return (
    <div>
      <input
        type="text"
        placeholder="Search for demands..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredDemands.map((demand) => (
          <li key={demand.id}>
            <button onClick={() => handleDemandSelect(demand)}>
              {demand.materialDescriptionCustomer}
            </button>
          </li>
        ))}
      </ul>

      <h3>Selected Demands:</h3>
      <ul>
        {selectedDemands.map((demand) => (
          <li key={demand.id}>{demand.materialDescriptionCustomer}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchableDemands;
