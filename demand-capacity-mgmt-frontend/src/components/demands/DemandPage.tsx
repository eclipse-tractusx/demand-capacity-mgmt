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

import React, { useContext, useState, useMemo ,useCallback} from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { DemandProp } from '../../interfaces/demand_interfaces';
import Pagination from '../Pagination';
import DemandsTable from './DemandsTable';
import DemandsSearch from '../Search';
import EditForm from './DemandEditForm';
import { FcCancel } from 'react-icons/fc';
import AddForm from './DemandAddForm';
import { DemandContext } from '../../contexts/DemandContextProvider';
import UnitsofMeasureContextContextProvider from '../../contexts/UnitsOfMeasureContextProvider';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';

const DemandsPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedDemand, setSelectedDemand] = useState<DemandProp | null>(null);
  const { deleteDemand } = useContext(DemandContext)!;
  const { demandprops, fetchDemandProps } = useContext(DemandContext)!; // Make sure to get the fetchDemands function from the context.

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [sortColumn, setSortColumn] = useState<keyof DemandProp | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [demandsPerPage, setDemandsPerPage] = useState(5); //Only show 5 items by default
  const [filteredDemands, setFilteredDemands] = useState<DemandProp[]>([]);

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

  const handleCloseAdd = () => setShowAddModal(false);

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
          <td><span className="badge rounded-pill text-bg-primary" id={demand.id}>Details</span></td>
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
            {demand.demandSeries && demand.demandSeries.length > 0 && demand.demandSeries[0].demandSeriesValues && demand.demandSeries[0].demandSeriesValues.length > 0
              ? demand.demandSeries[0].demandSeriesValues[0]?.calendarWeek?.split('T')[0] ?? 'N/A'
              : 'N/A'}
          </td>
          <td>
            {demand.demandSeries && demand.demandSeries.length > 0 && demand.demandSeries[0].demandSeriesValues && demand.demandSeries[0].demandSeriesValues.length > 0
              ? demand.demandSeries[0].demandSeriesValues[demand.demandSeries[0].demandSeriesValues.length - 1]?.calendarWeek?.split('T')[0] ?? 'N/A'
              : 'N/A'}
          </td>
          <td>
        <span className="badge rounded-pill text-bg-success" id="tag-ok">OK</span>
        {/*<span className="badge rounded-pill text-bg-warning" id="tag-warning">Warning</span>
        <span className="badge rounded-pill text-bg-danger" id="tag-danger">Danger</span>*/}
      </td>
          <td>
          <Button onClick={() => handleEdit(demand)} variant="outline-secondary">Edit</Button>
          </td>
          <td>
          <Button onClick={() => handleDeleteDemand(demand.id)} variant="outline-danger"><FcCancel/></Button>
          </td>
        </tr>
      )),
    [slicedDemands, handleDeleteDemand]
  );

  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
          <DemandsSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          </div>
          <div className="col-sm-6">
            <Button className="btn btn-success float-end" data-toggle="modal" onClick={() =>  setShowAddModal(true)}>
              <i className="material-icons">&#xE147;</i> <span>New Material Demand</span>
            </Button>
          </div>
        </div>
      </div>

              <DemandsTable
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          handleSort={(column: string| null) => handleSort(column)} // Pass the correct parameter type
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

      <Modal
        show={isEditModalOpen}
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
        <AddForm fetchDemandProps={fetchDemandProps}/>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default DemandsPage;