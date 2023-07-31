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

import React, { useContext, useState, useMemo, useCallback } from 'react';
import { Modal, Button,Form,Col,Row } from 'react-bootstrap';
import { CapacityGroupContext  } from '../../contexts/CapacityGroupsContextProvider';
import { CapacityGroup } from '../../interfaces/capacitygroup_interfaces';
import AddForm from '../demands/DemandAddForm';
import Pagination from '../Pagination';
import CapacityGroupsTable from './CapacityGroupsTable';
import Search from '../Search';
import CapacityGroupsModal from './CapacityGroupsModal';

const CapacityGroupsList: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCapacityGroup, setSelectedCapacityGroup] = useState<CapacityGroup | null>(null);

  const { capacitygroups } = useContext(CapacityGroupContext)!;
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false); // Add setShow to manage modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [capacitygroupsPerPage, setcapacitygroupsPerPage] = useState(20); // Set the default value here

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // If the same column is clicked again, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different column is clicked, set it as the new sort column and default to ascending order
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleEdit = (capacitygroup: CapacityGroup) => {
    setSelectedCapacityGroup(capacitygroup);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const filteredcapacitygroups = useMemo(() => {
    let sortedcapacitygroups = [...capacitygroups];

    if (searchQuery !== '') {
      sortedcapacitygroups = sortedcapacitygroups.filter((capacitygroup) =>
        capacitygroup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capacitygroup.id.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.companyId.toString().includes(searchQuery.toLowerCase())
      );
    }

    if (sortColumn !== '') {
      sortedcapacitygroups.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string') {
          // Sort strings alphabetically
          return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
        } else if (typeof aValue === 'number') {
          // Sort numbers numerically
          return aValue - bValue;
        }

        return 0;
      });

      if (sortOrder === 'desc') {
        // Reverse the array if the sort order is descending
        sortedcapacitygroups.reverse();
      }
    }

    return sortedcapacitygroups;
  }, [capacitygroups, searchQuery, sortColumn, sortOrder]);

  const slicedcapacitygroups = useMemo(() => {
    const indexOfLastCapacityGroup = currentPage * capacitygroupsPerPage;
    const indexOfFirstCapacityGroup = indexOfLastCapacityGroup - capacitygroupsPerPage;
    return filteredcapacitygroups.slice(indexOfFirstCapacityGroup, indexOfLastCapacityGroup);
  }, [filteredcapacitygroups, currentPage, capacitygroupsPerPage]);

  const totalPagesNum = useMemo(() => Math.ceil(filteredcapacitygroups.length / capacitygroupsPerPage), [
    filteredcapacitygroups,
    capacitygroupsPerPage,
  ]);

  const capacitygroupsItems = useMemo(
    () =>
      slicedcapacitygroups.map((capacitygroup) => (
        <tr key={capacitygroup.id}>
          <td>{capacitygroup.id}</td>
          <td>{capacitygroup.companyId}</td>
          <td>{capacitygroup.requiredValue}</td>
          <td>{capacitygroup.deliveredValue}</td>
          <td>{capacitygroup.maximumValue}</td>
          <td>{capacitygroup.description}</td>
          <td>{capacitygroup.startDate.split('T')[0]}</td>
          <td>{capacitygroup.endDate.split('T')[0]}</td>
          <td>
            {/* TODO Depending on status, this should be a different span*/}
        <span className="badge rounded-pill text-bg-success" id="tag-ok">OK</span>
        <span className="badge rounded-pill text-bg-warning" id="tag-warning">Warning</span>
        <span className="badge rounded-pill text-bg-danger" id="tag-danger">Danger</span>
      </td>
        </tr>
      )),
    [slicedcapacitygroups]
  );

  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
            <h2>Welcome USERID !</h2>
          </div>
          <div className="col-sm-6">
            <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          </div>
        </div>
      </div>

      <CapacityGroupsTable
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        handleSort={handleSort}
        capacitygroupsItems={capacitygroupsItems}
      />
      <div className="container">
      <div className="row">
          <Pagination
            pages={totalPagesNum}
            setCurrentPage={setCurrentPage}
            currentItems={slicedcapacitygroups}
            items={filteredcapacitygroups}
          />
        <div className="col-sm">
          <div className="float-end">
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">
              Per Page:
              </Form.Label>
              <Col sm="6">
              <Form.Control
                  type="number"
                  aria-describedby="capacitygroupsPerPageInput"
                  min={1}
                  htmlSize={10}
                  max={100}
                  value={capacitygroupsPerPage}
                  onChange={(e) => setcapacitygroupsPerPage(Number(e.target.value))}
                />
              </Col>
            </Form.Group>
          </Form>
          </div>
        </div>
      </div>
      </div>

      <CapacityGroupsModal
        show={show}
        handleClose={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Demand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close Button
          </Button>
        </Modal.Footer>
      </CapacityGroupsModal>
          </>
  );
};

export default CapacityGroupsList;
