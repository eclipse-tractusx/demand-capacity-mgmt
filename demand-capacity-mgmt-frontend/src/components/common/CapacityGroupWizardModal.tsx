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

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchableDemands from './SearchableDemandsList';
import { DemandProp } from '../../interfaces/demand_interfaces';

interface CapacityGroupWizardModalProps {
    show: boolean;
    onHide: () => void;
    selectedDemands: DemandProp[] | null
    demands: DemandProp[] |null;
  }

function CapacityGroupWizardModal({ show, onHide, selectedDemands,demands }: CapacityGroupWizardModalProps) {

  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [capacity, setCapacity] = useState('');

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission, e.g., send data to the server
    console.log('Group Name:', groupName);
    console.log('Capacity:', capacity);
    // Reset form and close modal
    setGroupName('');
    setCapacity('');
    setStep(1);
    onHide(); // Call the onHide function to close the modal
  };

  return (
    <>
      <Modal 
      show={show} 
      onHide={onHide} 
      size='lg'
      backdrop="static"
      keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Capacity Group Wizard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <Form>
              <Form.Group>
                <Form.Label>Step 1:</Form.Label>
                <br />
                <span>Capacity Group Name</span>
                <Form.Control
                  type="text"
                  placeholder="Enter Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
          {step === 2 && (
                <div>
                <SearchableDemands allDemands={demands} />
                </div>
          )}
          {step === 3 && (
            <div>
              <p>Step 3: Review and Submit</p>
              <p>Group Name: {groupName}</p>
              <p>Capacity: {capacity}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < 3 && (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CapacityGroupWizardModal;
