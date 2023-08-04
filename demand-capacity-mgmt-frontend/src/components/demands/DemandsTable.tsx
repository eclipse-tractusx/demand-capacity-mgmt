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

import React, { useEffect, useState } from 'react';

type DemandsTableProps = {
  sortColumn: string;
  sortOrder: string;
  handleSort: (column: string) => void;
  demandItems: React.ReactNode;
  refreshTable: boolean; // Add the refreshTable prop here
};

const DemandsTable: React.FC<DemandsTableProps> = ({ sortColumn, sortOrder, handleSort, demandItems, refreshTable }) => {
  const [tableRefreshed, setTableRefreshed] = useState(false);

  // When the refreshTable prop changes, set the tableRefreshed state to true to trigger the refresh
  useEffect(() => {
    if (refreshTable) {
      setTableRefreshed(true);
    }
  }, [refreshTable]);

  // Use the tableRefreshed state to re-render the table when it's set to true
  useEffect(() => {
    if (tableRefreshed) {
      setTableRefreshed(false); // Reset the tableRefreshed state
    }
  }, [tableRefreshed]);

  
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th onClick={() => handleSort('id')}>
            Id {sortColumn === 'id' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('companyId')}>
            Company Id {sortColumn === 'companyId' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('materialNumberCustomer')}>
            Material No. Customer {sortColumn === 'materialNumberCustomer' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('materialNumberSupplier')}>
            Material No. Supplier {sortColumn === 'materialNumberSupplier' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('demandCategory')}>
            Demand cat.{sortColumn === 'demandCategory' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('description')}>
            Description {sortColumn === 'description' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('startDate')}>
            Start Date {sortColumn === 'startDate' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('endDate')}>
            End Date {sortColumn === 'endDate' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('status')}>
            Status {sortColumn === 'status' && <i className="material-icons">&#x25B2;</i>}
          </th>
        </tr>
      </thead>
      <tbody>{demandItems}</tbody>
    </table>
  );
};

export default DemandsTable;
