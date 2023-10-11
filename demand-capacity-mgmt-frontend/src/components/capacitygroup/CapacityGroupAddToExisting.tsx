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
import React, { useContext, useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { FaSearch } from 'react-icons/fa';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import { CapacityGroupProp } from '../../interfaces/capacitygroup_interfaces';
import { DemandProp } from '../../interfaces/demand_interfaces';
import { LoadingMessage } from './../common/LoadingMessages';

interface CapacityGroupAddToExistingProps {
  show: boolean;
  onHide: () => void;
  checkedDemands: DemandProp[] | null;
}

const CapacityGroupAddToExisting: React.FC<CapacityGroupAddToExistingProps> = ({
  show,
  onHide,
  checkedDemands
}) => {
  const [selectedCapacityGroupId, setSelectedCapacityGroupId] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [filteredCapacityGroups, setFilteredCapacityGroups] = useState<CapacityGroupProp[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const capacityGroupContext = useContext(CapacityGroupContext);
  const { capacitygroups } = capacityGroupContext || {};

  const toggleDemandSelection = (demandId: string) => {
    if (selectedCapacityGroupId === demandId) {
      setSelectedCapacityGroupId(null);
    } else {
      setSelectedCapacityGroupId(demandId);
    }
  };

  const resetModalValues = () => {
    setSelectedCapacityGroupId(null);
    setSearchQuery('');
  };

  useEffect(() => {
    if (checkedDemands) {
      const customer = checkedDemands[0]?.customer.companyName || null;
      setCustomerFilter(customer);

      if (customer) {
        setIsLoading(true);

        if (capacitygroups) {
          const filteredGroups = capacitygroups.filter((group) => group.customerName === customer);
          setFilteredCapacityGroups(filteredGroups);
          setIsLoading(false);
        }
      }
    }
  }, [checkedDemands, capacityGroupContext, capacitygroups]);

  useEffect(() => {
    if (customerFilter && capacitygroups) {
      const filteredGroups = capacitygroups.filter((group) =>
        (group.name && group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (group.customerName && group.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (group.customerBPNL && group.customerBPNL.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (group.capacityGroupId && group.capacityGroupId.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCapacityGroups(filteredGroups);
    }
  }, [searchQuery, customerFilter, capacitygroups]);

  const handleLinkToCapacityGroup = () => {
    if (selectedCapacityGroupId && checkedDemands && checkedDemands.length > 0) {
      const demandIds = checkedDemands.map((demand) => demand.id);

      const capacityGroupLink = {
        capacityGroupID: selectedCapacityGroupId,
        linkedMaterialDemandID: demandIds,
      };

      capacityGroupContext?.linkToCapacityGroup(capacityGroupLink);

      onHide();
      resetModalValues(); 
    }
  };

  const renderDemands = () => {
    if (!checkedDemands || checkedDemands.length === 0) {
      return (
        <Alert variant="danger" onClose={onHide}>
          <p>No Demands selected.</p>
        </Alert>
      );
    }

    return (
      <>
        <div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1"><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for capacity groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <br />
          <span>Customer - Capacity Group Name</span>
          {isLoading ? (
            <LoadingMessage />
          ) : (
            <ListGroup>
              {filteredCapacityGroups &&
                filteredCapacityGroups.map((group) => (
                  <ListGroup.Item
                    key={group.capacityGroupId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span> {group.customerName} - {group.name}</span>
                    <Button
                      variant={selectedCapacityGroupId === group.internalId ? 'primary' : 'outline-primary'}
                      onClick={() => toggleDemandSelection(group.internalId)}
                    >
                      Select
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </div>
        <br />
        <div>
          <h4>Selected Capacity Group :</h4>
          <ListGroup>
            {selectedCapacityGroupId && (
              <ListGroup.Item>
                {selectedCapacityGroupId}
                <Button
                  variant="danger"
                  onClick={() => setSelectedCapacityGroupId(null)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </>
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Link to Existing Capacity Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderDemands()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {checkedDemands !== null && checkedDemands.length > 0 && (
          <Button variant="primary" onClick={handleLinkToCapacityGroup}>
            Link to Capacity Group
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CapacityGroupAddToExisting;
