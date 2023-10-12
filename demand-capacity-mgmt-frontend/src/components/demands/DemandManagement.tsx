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

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import { FaCopy, FaEllipsisV, FaInfoCircle, FaRedo, FaSearch, FaStar, FaTrashAlt } from 'react-icons/fa';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import { DemandContext } from '../../contexts/DemandContextProvider';
import UnitsofMeasureContextContextProvider from '../../contexts/UnitsOfMeasureContextProvider';
import { DemandProp, DemandSeries, DemandSeriesValue } from '../../interfaces/demand_interfaces';
import DemandDetailsModal from '../common/DemandDetailsModal';
import Pagination from '../common/Pagination';
import DemandsSearch from '../common/Search';
import AddForm from './DemandAddForm';
import EditForm from './DemandEditForm';

import DangerConfirmationModal, { ConfirmationAction } from '../common/DangerConfirmationModal';
import { LoadingMessage } from '../common/LoadingMessages';
import DemandManagementTable from './DemandManagementTable';

const DemandManagement: React.FC = () => {
  const [showEditModal, setIsEditModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(ConfirmationAction.Delete);

  const [selectedDemand, setSelectedDemand] = useState<DemandProp | null>(null);
  const { deleteDemand } = useContext(DemandContext)!;
  const { demandprops, fetchDemandProps, isLoading } = useContext(DemandContext)!; // Make sure to get the fetchDemands function from the context.

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [sortColumn, setSortColumn] = useState<keyof DemandProp | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [demandsPerPage, setDemandsPerPage] = useState(6); //Only show 5 items by default
  const [filteredDemands, setFilteredDemands] = useState<DemandProp[]>([]);

  /*useEffect(() => {
    fetchDemandProps();
  }, [fetchDemandProps]);*/

  const handleRefreshClick = async () => {
    await fetchDemandProps(); // Call your fetchEvents function to refresh the data
  };

  const handleSort = (column: string | null) => {
    if (sortColumn === column) {
      // If the same column is clicked again, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different column is clicked, set it as the new sort column and default to ascending order
      setSortColumn(column as keyof DemandProp | null);
      setSortOrder('asc');
    }
  };

  const handleDeleteDemand = useCallback(
    async (id: string) => {
      try {
        await deleteDemand(id);
        fetchDemandProps();
      } catch (error) {
        console.error('Error deleting demand:', error);
      }
    },
    [deleteDemand, fetchDemandProps]
  );

  const handleEdit = (demand: DemandProp) => {
    setSelectedDemand(demand);
    setIsEditModalOpen(true);
  };

  const handleDetails = (demand: DemandProp) => {
    setSelectedDemand(demand);
    setShowDetailsModal(true);
  };

  const handleCloseAdd = () => setShowAddModal(false);
  const handleCloseDetails = () => setShowDetailsModal(false);

  const handleDeleteButtonClick = (id: string) => {
    setDeleteItemId(id);
    setConfirmationAction(ConfirmationAction.Delete); // Set the confirmation action type
    setShowDeleteConfirmation(true);
  };


  const handleDeleteDemandWrapper = () => {
    if (deleteItemId) {
      handleDeleteDemand(deleteItemId)
        .catch((error) => {
          console.error('Error deleting demand:', error);
        })
        .finally(() => {
          // Close the delete confirmation modal
          setShowDeleteConfirmation(false);
          setDeleteItemId(null);
        });
    }
  };


  useMemo(() => {
    let sortedDemands = [...demandprops];

    if (searchQuery !== '') {
      sortedDemands = sortedDemands.filter((demand) =>
        demand.materialDescriptionCustomer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.id.toString().includes(searchQuery.toLowerCase()) ||
        demand.customer.bpn.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.materialNumberCustomer.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.materialNumberSupplier.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortColumn) {
      sortedDemands.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Sort strings alphabetically
          return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Sort numbers numerically
          return aValue - bValue;
        }

        // If the types are not string or number, return 0 (no sorting)
        return 0;
      });


      if (sortOrder === 'desc') {
        // Reverse the array if the sort order is descending
        sortedDemands.reverse();
      }
    }


    setFilteredDemands(sortedDemands);
  }, [demandprops, searchQuery, sortColumn, sortOrder]);

  const slicedDemands = useMemo(() => {
    const indexOfLastDemand = currentPage * demandsPerPage;
    const indexOfFirstDemand = indexOfLastDemand - demandsPerPage;
    return filteredDemands.slice(indexOfFirstDemand, indexOfLastDemand);
  }, [filteredDemands, currentPage, demandsPerPage]);

  const totalPagesNum = useMemo(() => Math.ceil(filteredDemands.length / demandsPerPage), [
    filteredDemands,
    demandsPerPage,
  ]);


  const demandItems = useMemo(
    () =>
      slicedDemands.map((demand) => (
        <tr key={demand.id}>
          <td><FaStar className="text-muted" opacity='0.2' size={25} /></td>
          <td>
            <Button data-toggle="modal" onClick={() => handleDetails(demand)} variant="outline-primary" >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FaSearch size={20} />
              </div>
            </Button>
          </td>
          <td>{demand.customer.bpn}</td>
          <td>{demand.materialNumberCustomer}</td>
          <td>{demand.materialNumberSupplier}</td>
          <td>
            {demand.demandSeries && demand.demandSeries.length > 0
              ? demand.demandSeries[0].demandCategory?.demandCategoryName || 'N/A'
              : 'N/A'}
          </td>
          <td>{demand.materialDescriptionCustomer}</td>
          <td>
            {demand?.demandSeries?.length ? (
              demand.demandSeries.reduce((earliest: string | null, series: DemandSeries) => {
                const values = series.demandSeriesValues || [];
                const earliestValue = values.reduce((earliestVal: string | null, value: DemandSeriesValue) => {
                  if (!earliestVal || value.calendarWeek < earliestVal) {
                    return value.calendarWeek;
                  }
                  return earliestVal;
                }, null);
                if (!earliest || (earliestValue && earliestValue < earliest)) {
                  return earliestValue;
                }
                return earliest;
              }, null)?.split('T')[0] ?? 'N/A'
            ) : 'N/A'}
          </td>
          <td>
            {demand?.demandSeries?.length ? (
              demand.demandSeries.reduce((latest: string | null, series: DemandSeries) => {
                const values = series.demandSeriesValues || [];
                const latestValue = values.reduce((latestVal: string | null, value: DemandSeriesValue) => {
                  if (!latestVal || value.calendarWeek > latestVal) {
                    return value.calendarWeek;
                  }
                  return latestVal;
                }, null);
                if (!latest || (latestValue && latestValue > latest)) {
                  return latestValue;
                }
                return latest;
              }, null)?.split('T')[0] ?? 'N/A'
            ) : 'N/A'}
          </td>

          <td>
            <span className="badge rounded-pill bg-primary text-white" id="tag-ok">Linked</span>
            <span className="badge rounded-pill bg-warning text-black" id="tag-warning">TODO</span>
            <span className="badge rounded-pill bg-danger text-white" id="tag-danger">Unlinked</span>
          </td>
          <td>
            <Button onClick={() => handleEdit(demand)} variant="outline-secondary">Edit</Button>
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant="light" id={`dropdown-menu-${demand.id}`}>
                <span ><FaEllipsisV /></span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDetails(demand)}><FaInfoCircle /> Details</Dropdown.Item>
                <Dropdown.Item onClick={() => { navigator.clipboard.writeText(demand.id) }}><FaCopy /> Copy ID</Dropdown.Item>
                <Dropdown.Item className="red-delete-item" onClick={() => handleDeleteButtonClick(demand.id)}><FaTrashAlt /> Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      )),
    [slicedDemands]
  );

  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
            <DemandsSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="col-sm-6 d-flex justify-content-end align-items-center">
            <Button className="btn btn-success me-1" data-toggle="modal" onClick={() => setShowAddModal(true)}>
              <span>New Material Demand</span>
            </Button>
            <Button className='btn btn-primary' onClick={handleRefreshClick}>
              <FaRedo className="spin-on-hover" />
            </Button>
          </div>
        </div>

      </div>
      {isLoading ? ( // Conditional rendering based on loading state
        <LoadingMessage />
      ) : (
        <>
          <div className='table-responsive'>
            <DemandManagementTable
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              handleSort={(column: string | null) => handleSort(column)} // Pass the correct parameter type
              demandItems={demandItems}
            />
          </div>
          <div className="container">
            <div className="row">
              <Pagination
                pages={totalPagesNum}
                setCurrentPage={setCurrentPage}
                currentItems={slicedDemands}
                items={filteredDemands}
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
                          aria-describedby="demandsPerPageInput"
                          min={1}
                          htmlSize={10}
                          max={100}
                          value={demandsPerPage}
                          onChange={(e) => setDemandsPerPage(Number(e.target.value))}
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={showEditModal}
            onHide={() => setIsEditModalOpen(false)}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UnitsofMeasureContextContextProvider>
                <DemandCategoryContextProvider>
                  <CompanyContextProvider>
                    {selectedDemand && <EditForm theDemand={selectedDemand} onCloseModal={() => setIsEditModalOpen(false)} />}
                  </CompanyContextProvider>
                </DemandCategoryContextProvider>
              </UnitsofMeasureContextContextProvider>
            </Modal.Body>
          </Modal>

          <Modal
            show={showAddModal}
            onHide={handleCloseAdd}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>New Material Demand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddForm fetchDemandProps={fetchDemandProps} />
            </Modal.Body>
          </Modal>


          <DangerConfirmationModal
            show={showDeleteConfirmation}
            onCancel={() => {
              setShowDeleteConfirmation(false);
              setDeleteItemId(null);
            }}
            onConfirm={handleDeleteDemandWrapper}
            action={confirmationAction}
          />


          <DemandDetailsModal
            show={showDetailsModal}
            onHide={handleCloseDetails}
            dialogClassName="custom-modal"
            fullscreen="xl"
            selectedDemand={selectedDemand} />

        </>
      )}
    </>
  );
};

export default DemandManagement;
