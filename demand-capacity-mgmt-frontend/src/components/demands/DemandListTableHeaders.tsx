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

import { BiCaretDown, BiCaretUp } from 'react-icons/bi';
import { useUser } from '../../contexts/UserContext';

type DemandsTableProps = {
  sortColumn: string | null;
  sortOrder: string;
  handleSort: (column: string | null) => void;
  demandItems: React.ReactNode;
  hasfavorites: boolean
};

const DemandListTable: React.FC<DemandsTableProps> = ({ sortColumn, sortOrder, handleSort, demandItems, hasfavorites }) => {
  const { user } = useUser();
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          {hasfavorites && <th></th>}
          {hasfavorites && <th></th>}
          <th></th>
          {user?.role === 'SUPPLIER' && (
            <>
              <th onClick={() => handleSort('customer.bpn')}>
                Customer BPN{' '}
                {sortColumn === 'customer.bpn' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'customer.bpn' && sortOrder === 'desc' && <BiCaretDown />}
                {!sortColumn && <i className="material-icons">...</i>}
              </th>
            </>
          )}

          {user?.role === 'CUSTOMER' && (
            <>
              <th onClick={() => handleSort('supplier.bpn')}>
                Supplier BPN{' '}
                {sortColumn === 'supplier.bpn' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'supplier.bpn' && sortOrder === 'desc' && <BiCaretDown />}
                {!sortColumn && <i className="material-icons">...</i>}
              </th>
            </>
          )}
          <th onClick={() => handleSort('materialNumberCustomer')}>
            Material No. Customer{' '}
            {sortColumn === 'materialNumberCustomer' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'materialNumberCustomer' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('materialNumberSupplier')}>
            Material No. Supplier{' '}
            {sortColumn === 'materialNumberSupplier' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'materialNumberSupplier' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('demandSeries.demandCategory')}>
            Demand cat.
            {sortColumn === 'demandSeries.demandCategory' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'demandSeries.demandCategory' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('materialDescriptionCustomer')}>
            Description{' '}
            {sortColumn === 'materialDescriptionCustomer' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'materialDescriptionCustomer' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('startDate')}>
            Start Date {sortColumn === 'startDate' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'startDate' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('endDate')}>
            End Date {sortColumn === 'endDate' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'endDate' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('status')}>
            Status {sortColumn === 'status' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'status' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
        </tr>
      </thead>
      <tbody>{demandItems}</tbody>
    </table>
  );
};

export default DemandListTable;
