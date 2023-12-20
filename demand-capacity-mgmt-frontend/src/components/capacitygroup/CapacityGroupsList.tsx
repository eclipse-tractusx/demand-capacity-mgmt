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


import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaCopy, FaEllipsisV, FaEye, FaRedo } from 'react-icons/fa';
import { LuStar } from 'react-icons/lu';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import { CompanyContext } from '../../contexts/CompanyContextProvider';
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { useUser } from '../../contexts/UserContext';
import '../../index.css';
import { CapacityGroupProp } from '../../interfaces/capacitygroup_interfaces';
import { EventType } from '../../interfaces/event_interfaces';
import {
  FavoriteType,
  SingleCapacityGroupFavoriteResponse
} from "../../interfaces/favorite_interfaces";
import { getUserGreeting } from '../../interfaces/user_interface';
import { LoadingMessage } from '../common/LoadingMessages';
import Pagination from '../common/Pagination';
import Search from '../common/Search';
import CapacityGroupsTable from './CapacityGroupsTableHeaders';


const CapacityGroupsList: React.FC = () => {
  const { user } = useUser();
  const { capacitygroups, isLoading, fetchCapacityGroupsWithRetry } = useContext(CapacityGroupContext)!;
  const [filteredCapacityGroups, setFilteredCapacityGroups] = useState<CapacityGroupProp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [capacitygroupsPerPage, setcapacitygroupsPerPage] = useState(20); // Set the default value here
  const { addFavorite, fetchFavoritesByType, deleteFavorite } = useContext(FavoritesContext)!;
  const { findCompanyByCompanyID } = useContext(CompanyContext)!;
  const [favoriteCapacityGroups, setFavoriteCapacityGroups] = useState<string[]>([]);

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
  const fetchFavorites = useCallback(async () => {
    try {
      const favorites = await fetchFavoritesByType(FavoriteType.CAPACITY_GROUP);
      if (favorites && favorites.capacityGroups) {
        setFavoriteCapacityGroups(favorites.capacityGroups.map((fav: SingleCapacityGroupFavoriteResponse) => fav.id));
      }
    } catch (error) {
      console.error('Error fetching favorites by type in DemandList:', error);
    }
  }, []);

  const handleRefreshClick = useCallback(async () => {
    await fetchCapacityGroupsWithRetry();
    await fetchFavorites();
  }, [fetchCapacityGroupsWithRetry, fetchFavorites]);

  const toggleFavorite = useCallback(async (capacityGroupID: string) => {
    if (favoriteCapacityGroups.includes(capacityGroupID)) {
      await deleteFavorite(capacityGroupID)
      setFavoriteCapacityGroups(prev => prev.filter(id => id !== capacityGroupID));
    } else {
      await addFavorite(capacityGroupID, FavoriteType.CAPACITY_GROUP)
      setFavoriteCapacityGroups(prev => [...prev, capacityGroupID]);
    }
    handleRefreshClick();
  }, [favoriteCapacityGroups, handleRefreshClick, addFavorite, deleteFavorite]);



  useEffect(() => {
    fetchFavorites();
  }, [capacitygroups, fetchFavorites]);


  const isCapacityGroupFavorite = useMemo(() => {
    const isFavorited = (capacityGroupID: string) => favoriteCapacityGroups.includes(capacityGroupID);
    return isFavorited;
  }, [favoriteCapacityGroups]);

  useMemo(() => {
    let filteredcapacitygroups = [...capacitygroups];

    if (searchQuery !== '') {
      filteredcapacitygroups = filteredcapacitygroups.filter((capacitygroup) =>
        capacitygroup.internalId.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capacitygroup.customerBPNL.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.customerName.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.supplierBNPL.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.numberOfMaterials.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.favoritedBy.toString().includes(searchQuery.toLowerCase()) ||
        capacitygroup.linkStatus.toString().includes(searchQuery.toLowerCase())
      );
    }

    // Separate favorited and unfavorited demands
    const favoriteCapacityGroups = filteredcapacitygroups.filter((capacitygroup) => isCapacityGroupFavorite(capacitygroup.internalId));
    const unfavoritedCapacityGroups = filteredcapacitygroups.filter((capacitygroup) => !isCapacityGroupFavorite(capacitygroup.internalId));

    // Concatenate favorited and unfavorited demands
    const sortedCapacityGroups = [...favoriteCapacityGroups, ...unfavoritedCapacityGroups];

    if (sortColumn !== '') {
      sortedCapacityGroups.sort((a, b) => {
        const aValue = String(a[sortColumn]);
        const bValue = String(b[sortColumn]);

        return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
      });

      if (sortOrder === 'desc') {
        // Reverse the array if the sort order is descending
        sortedCapacityGroups.reverse();
      }
    }

    setFilteredCapacityGroups(sortedCapacityGroups);
  }, [capacitygroups, isCapacityGroupFavorite, searchQuery, sortColumn, sortOrder]);

  const slicedcapacitygroups = useMemo(() => {
    const indexOfLastCapacityGroup = currentPage * capacitygroupsPerPage;
    const indexOfFirstCapacityGroup = indexOfLastCapacityGroup - capacitygroupsPerPage;
    return filteredCapacityGroups.slice(indexOfFirstCapacityGroup, indexOfLastCapacityGroup);
  }, [filteredCapacityGroups, currentPage, capacitygroupsPerPage]);

  const totalPagesNum = useMemo(() => Math.ceil(filteredCapacityGroups.length / capacitygroupsPerPage), [
    filteredCapacityGroups,
    capacitygroupsPerPage,
  ]);

  const capacitygroupsItems = useMemo(
    () =>
      slicedcapacitygroups.map((capacitygroup) => (
        <tr key={capacitygroup.internalId}>
          <td>
            <span className='inlinefav'>
              <LuStar
                className={favoriteCapacityGroups.includes(capacitygroup.internalId) ? "text-warning" : "text-muted"}
                opacity={favoriteCapacityGroups.includes(capacitygroup.internalId) ? "1" : "0.2"}
                onClick={() => toggleFavorite(capacitygroup.internalId)}
                size={25}
              />
            </span>
          </td>
          <td><center>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-copy-${capacitygroup.internalId}-open`}>Go to Details</Tooltip>}
            >
              <Button href={`/details/${capacitygroup.internalId}`} target='new-tab' variant="outline-primary" >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <FaEye size={20} />
                </div>
              </Button>
            </OverlayTrigger>
          </center>
          </td>
          <td><center>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-copy-${capacitygroup.internalId}`}>{capacitygroup.internalId}</Tooltip>}
            >
              <Button
                variant="outline-info"
                onClick={() => {
                  // Function to copy the internalId to the clipboard
                  navigator.clipboard.writeText(capacitygroup.internalId);
                }}
              >
                <FaCopy />
              </Button>
            </OverlayTrigger></center>
          </td>
          <td>{capacitygroup.name}</td>
          {user?.role === 'SUPPLIER' && (
            <>
              <td>{capacitygroup.customerBPNL}</td>
              <td>{capacitygroup.customerName}</td>
            </>
          )}

          {user?.role === 'CUSTOMER' && (
            <>
              <td>{capacitygroup.supplierBNPL}</td>
            </>
          )}

          <td>{capacitygroup.numberOfMaterials}</td>
          <td>
            {capacitygroup.linkStatus === EventType.TODO ? (
              <span className="badge rounded-pill text-bg-warning" id="tag-warning">
                Todo
              </span>
            ) : capacitygroup.linkStatus === EventType.STATUS_IMPROVEMENT ? (
              <span className="badge rounded-pill text-bg-success" id="tag-ok">
                Up
              </span>
            ) : capacitygroup.linkStatus === EventType.STATUS_REDUCTION ? (
              <span className="badge rounded-pill text-bg-danger" id="tag-danger">
                Down
              </span>
            ) :
              capacitygroup.linkStatus === EventType.GENERAL_EVENT ? (
                <span className="badge rounded-pill text-bg-success" id="tag-ok">
                  General
                </span>
              )
                : (
                  <span className="badge rounded-pill text-bg-secondary">N/A</span>
                )}
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant="light" id={`dropdown-menu-${capacitygroup.internalId}`}>
                <span ><FaEllipsisV /></span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href={`/details/${capacitygroup.internalId}`} target='new-tab'>Details</Dropdown.Item>
                <Dropdown.Item className="red-delete-item" >Delete (WIP)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      )),
    [slicedcapacitygroups, favoriteCapacityGroups, toggleFavorite]
  );

  return (
    <>
      <div className="table-title">
        <div className="row">
          <div className="col-sm-6">
            <h3>{getUserGreeting(user)}!</h3>
            <span className='text-muted'>{findCompanyByCompanyID(user?.companyID || '')?.companyName || ''}</span>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-11">
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
              <div className="col-sm-1">
                <Button className='mx-1' variant="primary" onClick={handleRefreshClick}>
                  <FaRedo className="spin-on-hover" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? ( // Conditional rendering based on loading state
        <LoadingMessage />
      ) : (<>
        <div className='table'>
          <CapacityGroupsTable
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            handleSort={handleSort}
            capacitygroupsItems={capacitygroupsItems}
          />
        </div>
        <div className="container">
          <div className="row">
            <Pagination
              pages={totalPagesNum}
              setCurrentPage={setCurrentPage}
              currentItems={slicedcapacitygroups}
              items={filteredCapacityGroups}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          const newValue = value === '' ? 1 : Math.max(1, parseInt(value)); // Ensure it's not empty and not less than 1
                          setcapacitygroupsPerPage(newValue);
                        }}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </>
  );
};

export default CapacityGroupsList;

