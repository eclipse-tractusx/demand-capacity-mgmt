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
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { DemandProp } from '../../interfaces/demand_interfaces';
import { SingleCapacityGroup } from '../../interfaces/capacitygroup_interfaces';

interface CapacityGroupAddToExistingProps {
  show: boolean;
  onHide: () => void;
  checkedDemands: DemandProp[] | null;
  capacityGroups: SingleCapacityGroup[] | null;
}

const CapacityGroupAddToExisting: React.FC<CapacityGroupAddToExistingProps> = ({
  show,
  onHide,
  checkedDemands,
  capacityGroups
}) => {
  const [selectedCapacityGroupId, setSelectedCapacityGroupId] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [filteredCapacityGroups, setFilteredCapacityGroups] = useState<SingleCapacityGroup[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Filter capacity groups by customer
    if (checkedDemands) {
      const customer = checkedDemands[0]?.customer.companyName || null;
      setCustomerFilter(customer);

      if (customer && capacityGroups) {
        const filteredGroups = capacityGroups.filter(
          (group) => group.customer.companyName === customer
        );
        setFilteredCapacityGroups(filteredGroups);
      }
    }
  }, [checkedDemands, capacityGroups]);

  const handleLinkToCapacityGroup = () => {
    if (selectedCapacityGroupId) {
      onHide();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter capacity groups based on the search query
    if (customerFilter && capacityGroups) {
      const filteredGroups = capacityGroups.filter(
        (group) =>
          group.customer.companyName === customerFilter &&
          (group.name.includes(query) || group.capacityGroupId.includes(query))
      );
      setFilteredCapacityGroups(filteredGroups);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Link to Existing Capacity Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form.Control
            type="text"
            placeholder="Search for capacity groups..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <br />
          <ListGroup>
            {filteredCapacityGroups &&
              filteredCapacityGroups.map((group) => (
                <ListGroup.Item
                  key={group.capacityGroupId}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{group.name}</span>
                  <Button
                    variant="outline-primary"
                    onClick={() => setSelectedCapacityGroupId(group.capacityGroupId)}
                  >
                    Select
                  </Button>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
        <div>
          <h4>Selected Capacity Groups to Link:</h4>
          <ListGroup>
            {selectedCapacityGroupId && (
              <ListGroup.Item>
                {selectedCapacityGroupId}
                <Button
                  variant="outline-danger"
                  onClick={() => setSelectedCapacityGroupId(null)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleLinkToCapacityGroup}>
          Link to Capacity Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CapacityGroupAddToExisting;
