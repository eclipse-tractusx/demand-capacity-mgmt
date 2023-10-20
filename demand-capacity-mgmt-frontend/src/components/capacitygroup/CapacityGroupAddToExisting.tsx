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
import React, { useContext, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaSearch } from 'react-icons/fa';
import Select from 'react-select';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import { DemandProp } from '../../interfaces/demand_interfaces';

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
  const [selectedCapacityGroup, setSelectedCapacityGroup] = useState<{ value: string; label: string } | null>(null);

  const capacityGroupContext = useContext(CapacityGroupContext);
  const { capacitygroups } = capacityGroupContext || {};

  const resetModalValues = () => {
    setSelectedCapacityGroup(null);
  };

  const handleLinkToCapacityGroup = () => {
    if (selectedCapacityGroup?.value && checkedDemands && checkedDemands.length > 0) {
      const demandIds = checkedDemands.map((demand) => {
        console.log(demand.id , "ssssssssss");
        return demand.id

      });
      const capacityGroupLink = {
        capacityGroupID: selectedCapacityGroup?.value,
        linkedMaterialDemandID: demandIds,
      };

      capacityGroupContext?.linkToCapacityGroup(capacityGroupLink);

      onHide();
      resetModalValues();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Link to Existing Capacity Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {checkedDemands && checkedDemands.length > 0 ? (
          <>
            <div>
              <h6>Selected Capacity Group</h6>
              <Select
                options={capacitygroups?.map(cgp => ({
                  value: cgp.internalId,
                  label: `${cgp.name} - ${cgp.numberOfMaterials} - ${cgp.customerBPNL}`
                }))}
                value={selectedCapacityGroup}
                onChange={(selectedOption) => setSelectedCapacityGroup(selectedOption)}
                isSearchable
                placeholder={<><FaSearch /> Search for capacity groups...</>}
              />
              <br />
            </div>
          </>
        ) : (
          <Alert variant="danger">
            <p>No Demands selected.</p>
          </Alert>
        )}
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
