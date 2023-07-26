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

import React, { useContext } from 'react';
import { DemandCategoryContext} from '../contexts/DemandCategoryProvider';

const DemandCategoryOptions: React.FC = () => {
  const demandCategoryContextData = useContext(DemandCategoryContext);
  const { demandcategories } = demandCategoryContextData || {}; // Ensure context data is available

  // Use the demandcategories array to fill the <select> options
  return (
<>
<option disabled={true} value="">
          --Choose an option--
        </option>
        {demandcategories &&
          demandcategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.demandCategoryName}
            </option>
          ))}
</>
  );
};
 export default DemandCategoryOptions;
