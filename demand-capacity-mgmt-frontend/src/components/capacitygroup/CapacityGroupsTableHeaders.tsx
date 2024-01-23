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

import React from 'react';
import { BiCaretDown, BiCaretUp } from 'react-icons/bi';
import { useUser } from '../../contexts/UserContext';

type CapacityGroupsTableProps = {
  sortColumn: string;
  sortOrder: string;
  handleSort: (column: string) => void;
  capacitygroupsItems: React.ReactNode;
};



const CapacityGroupsTable: React.FC<CapacityGroupsTableProps> = ({ sortColumn, sortOrder, handleSort, capacitygroupsItems }) => {
  const { user } = useUser();
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th onClick={() => handleSort('internalId')}>
            Internal ID
            {sortColumn === 'internalId' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'internalId' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('name')}>
            Name
            {sortColumn === 'name' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'name' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          {user?.role === 'SUPPLIER' && (
            <>
              <th onClick={() => handleSort('customerBPNL')}>
                Customer BPNL
                {sortColumn === 'customerBPNL' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'customerBPNL' && sortOrder === 'desc' && <BiCaretDown />}
              </th>
              <th onClick={() => handleSort('customerName')}>
                Customer
                {sortColumn === 'customerName' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'customerName' && sortOrder === 'desc' && <BiCaretDown />}
              </th>
            </>
          )}

          {user?.role === 'CUSTOMER' && (
            <>
              <th onClick={() => handleSort('supplierBNPL')}>
                Supplier BPNL
                {sortColumn === 'supplierBNPL' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'supplierBNPL' && sortOrder === 'desc' && <BiCaretDown />}
              </th>
              <th onClick={() => handleSort('supplierName')}>
                Supplier
                {sortColumn === 'supplierName' && sortOrder === 'asc' && <BiCaretUp />}
                {sortColumn === 'supplierName' && sortOrder === 'desc' && <BiCaretDown />}
              </th>
            </>
          )}
          <th onClick={() => handleSort('numberOfMaterials')}>
            # of Materials
            {sortColumn === 'numberOfMaterials' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'numberOfMaterials' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
          <th onClick={() => handleSort('status')}>
            Status
            {sortColumn === 'status' && sortOrder === 'asc' && <BiCaretUp />}
            {sortColumn === 'status' && sortOrder === 'desc' && <BiCaretDown />}
          </th>
        </tr>
      </thead>
      <tbody>{capacitygroupsItems}</tbody>
    </table>
  );
};

export default CapacityGroupsTable;
