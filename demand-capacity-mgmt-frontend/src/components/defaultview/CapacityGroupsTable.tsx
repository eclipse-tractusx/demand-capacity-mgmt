/*
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *  See the NOTICE file(s) distributed with this work for additional information regarding copyright ownership.
 *
 *  This program and the accompanying materials are made available under the terms of the Apache License, Version 2.0 which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';


type CapacityGroupsTableProps = {
  sortColumn: string;
  sortOrder: string;
  handleSort: (column: string) => void;
  capacitygroupsItems: React.ReactNode;
};

const CapacityGroupsTable: React.FC<CapacityGroupsTableProps> = ({ sortColumn, sortOrder, handleSort, capacitygroupsItems }) => {
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th onClick={() => handleSort('id')}>
            Internal ID {sortColumn === 'id' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('name')}>
            Name {sortColumn === 'name' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('customberbpnl')}>
            Customber BPNL {sortColumn === 'customberbpnl' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('customername')}>
            Customer Name {sortColumn === 'customername' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('supplierbpnl')}>
            Supplier BPNL {sortColumn === 'supplierbpnl' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('suppliername')}>
            Supplier Name {sortColumn === 'suppliername' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('nmaterials')}>
            # of Materials {sortColumn === 'nmaterials' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('favoritedby')}>
            Favorited by {sortColumn === 'favoritedby' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('status')}>
            Status {sortColumn === 'status' && <i className="material-icons">&#x25B2;</i>}
          </th>
        </tr>
      </thead>
      <tbody>{capacitygroupsItems}</tbody>
    </table>
  );
};

export default CapacityGroupsTable;
