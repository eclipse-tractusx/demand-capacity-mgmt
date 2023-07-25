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


type DemandsTableProps = {
  sortColumn: string;
  sortOrder: string;
  handleSort: (column: string) => void;
  demandItems: React.ReactNode;
};

const DemandsTable: React.FC<DemandsTableProps> = ({ sortColumn, sortOrder, handleSort, demandItems }) => {
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
          <th onClick={() => handleSort('requiredValue')}>
            Required Value {sortColumn === 'requiredValue' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('deliveredValue')}>
            Delivered Value {sortColumn === 'deliveredValue' && <i className="material-icons">&#x25B2;</i>}
          </th>
          <th onClick={() => handleSort('maximumValue')}>
            Maximum Value {sortColumn === 'maximumValue' && <i className="material-icons">&#x25B2;</i>}
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
