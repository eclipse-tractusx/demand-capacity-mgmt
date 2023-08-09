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

type DemandsTableProps = {
  sortColumn: string | null;
  sortOrder: string;
  handleSort: (column: string | null) => void;
  demandItems: React.ReactNode;
};

const DemandsTable: React.FC<DemandsTableProps> = ({ sortColumn, sortOrder, handleSort, demandItems }) => {

  return (
<table className="table table-striped table-hover">
    <thead>
      <tr>
        <th></th>
        <th onClick={() => handleSort('customer.bpn')}>
          Company Id{' '}
          {sortColumn === 'customer.bpn' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'customer.bpn' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
          {!sortColumn && <i className="material-icons">...</i>}
        </th>
        <th onClick={() => handleSort('materialNumberCustomer')}>
          Material No. Customer{' '}
          {sortColumn === 'materialNumberCustomer' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'materialNumberCustomer' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('materialNumberSupplier')}>
          Material No. Supplier{' '}
          {sortColumn === 'materialNumberSupplier' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'materialNumberSupplier' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('demandSeries.demandCategory')}>
          Demand cat.
          {sortColumn === 'demandSeries.demandCategory' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'demandSeries.demandCategory' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('materialDescriptionCustomer')}>
          Description{' '}
          {sortColumn === 'materialDescriptionCustomer' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'materialDescriptionCustomer' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('startDate')}>
          Start Date {sortColumn === 'startDate' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'startDate' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('endDate')}>
          End Date {sortColumn === 'endDate' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'endDate' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
        <th onClick={() => handleSort('status')}>
          Status {sortColumn === 'status' && sortOrder === 'asc' && <i className="material-icons">&#x25B2;</i>}
          {sortColumn === 'status' && sortOrder === 'desc' && <i className="material-icons">&#x25BC;</i>}
        </th>
      </tr>
    </thead>
    <tbody>{demandItems}</tbody>
  </table>
  );
};

export default DemandsTable;
