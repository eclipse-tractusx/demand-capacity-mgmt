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

import React, { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Form, Col, Row, Dropdown } from 'react-bootstrap';
import { DemandProp, DemandSeries, DemandSeriesValue } from '../../interfaces/demand_interfaces';
import Pagination from '../common/Pagination';
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import { DemandContext } from '../../contexts/DemandContextProvider';
import DemandDetailsModal from '../common/DemandDetailsModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import DemandListTable from './DemandListTable';
import LoadingMessage from '../common/LoadingMessage';
import CapacityGroupWizardModal from '../common/CapacityGroupWizardModal';

const DemandList: React.FC<{ searchQuery?: string; showWizard?: boolean; toggleWizardModal?: () => void }> = ({
  searchQuery = '',
  showWizard = false,
  toggleWizardModal,
}) => {

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [selectedDemand, setSelectedDemand] = useState<DemandProp | null>(null);
  const { deleteDemand } = useContext(DemandContext)!;
  const { demandprops, fetchDemandProps, isLoading } = useContext(DemandContext)!;  // Make sure to get the fetchDemands function from the context.

  const [showWizardModal, setShowWizardModal] = useState(false);
  const [selectedDemands, setSelectedDemands] = useState<DemandProp[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof DemandProp | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [demandsPerPage, setDemandsPerPage] = useState(6); //Only show 5 items by default
  const [filteredDemands, setFilteredDemands] = useState<DemandProp[]>([]);

  useEffect(() => {
    // Update showWizardModal based on the showWizard prop, providing a default value of false if it's undefined
    setShowWizardModal(showWizard || false);
    fetchDemandProps();
  }, [showWizard, fetchDemandProps]);
  

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

  const handleCloseWizardModal = () => {
    if (toggleWizardModal) {
      toggleWizardModal(); // Close the modal and set showWizard to false if the prop is provided
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

  const handleDetails = (demand: DemandProp) => {
    setSelectedDemand(demand);
    setShowDetailsModal(true);
  };

  const handleDeleteButtonClick = (id: string) => {
    setDeleteItemId(id); // Set the ID of the item to be deleted
    setShowDeleteConfirmation(true); // Show the delete confirmation modal
  };

  const handleDeleteDemandWrapper = () => {
    if (deleteItemId) {
      handleDeleteDemand(deleteItemId)
        .then(() => {
          // After successful deletion, you can perform any additional actions if needed
          // For example, you can fetch updated data
          fetchDemandProps();
        })
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


  const handleCloseDetails = () => setShowDetailsModal(false);

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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, demandId: string) => {
    if (event.target.checked) {
      // If the checkbox is checked, find the corresponding demand and add it to the selectedDemands array
      const selectedDemandToAdd = filteredDemands.find((demand) => demand.id === demandId);
      if (selectedDemandToAdd) {
        setSelectedDemands((prevSelectedDemands) => [...prevSelectedDemands, selectedDemandToAdd]);
      }
    } else {
      // If the checkbox is unchecked, remove the demand from the selectedDemands array
      setSelectedDemands((prevSelectedDemands) =>
        prevSelectedDemands.filter((demand) => demand.id !== demandId)
      );
    }
  };

  const demandItems = useMemo(
    () =>
      slicedDemands.map((demand) => (
        <tr key={demand.id}>
          <td>
            <input
              type="checkbox"
              className="table-checkbox"
              onChange={(e) => handleCheckboxChange(e, demand.id)}
              checked={selectedDemands.includes(demand)} // Check if the demand is in the selectedDemands array
            />
          </td>
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
            <span className="badge rounded-pill text-bg-success" id="tag-ok">Up</span>
            <span className="badge rounded-pill text-bg-warning" id="tag-warning">TODO</span>
            <span className="badge rounded-pill text-bg-danger" id="tag-danger">Down</span>
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant="light" id={`dropdown-menu-${demand.id}`}>
                <span ><FaEllipsisV /></span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDetails(demand)}>Details</Dropdown.Item>
                <Dropdown.Item onClick={() => { navigator.clipboard.writeText(demand.id) }}>Copy ID</Dropdown.Item>
                <Dropdown.Item className="red-delete-item" onClick={() => handleDeleteButtonClick(demand.id)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      )),
    [slicedDemands, selectedDemands]
  );

  return (
    <>
      {isLoading ? ( // Conditional rendering based on loading state
        <LoadingMessage />
      ) : (
        <>
          <DemandListTable
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            handleSort={(column: string | null) => handleSort(column)} // Pass the correct parameter type
            demandItems={demandItems}
          />

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

          <DeleteConfirmationModal
            show={showDeleteConfirmation}
            onCancel={() => {
              setShowDeleteConfirmation(false);
              setDeleteItemId(null);
            }}
            onConfirm={handleDeleteDemandWrapper}
          />

          <DemandDetailsModal
            show={showDetailsModal}
            onHide={handleCloseDetails}
            dialogClassName="custom-modal"
            fullscreen="xl"
            selectedDemand={selectedDemand} />

            <CapacityGroupWizardModal
                  show={showWizard}
                  onHide={handleCloseWizardModal} // Call this function when the modal is closed
                  checkedDemands={selectedDemands}
                  demands={filteredDemands}
                />

        </>
      )}
    </>
  );
};

export default DemandList;
