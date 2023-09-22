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
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { DemandProp } from '../../interfaces/demand_interfaces';
import { FormControl, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import StepBreadcrumbs from './StepsBreadCrumbs';

interface CapacityGroupWizardModalProps {
  show: boolean;
  onHide: () => void;
  checkedDemands: DemandProp[] | null;
  demands: DemandProp[] | null;
}

function CapacityGroupWizardModal({ show, onHide, checkedDemands, demands }: CapacityGroupWizardModalProps) {
  const [step, setStep] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isInputShaking, setIsInputShaking] = useState(false);

  useEffect(() => {
    if (checkedDemands) {
      setSelectedDemands([...checkedDemands]);
    }
  }, [checkedDemands]);

  const nextStep = () => {
    if (step === 1 && !groupName) {
      // Trigger the animation by setting isInputShaking to true
      setIsInputShaking(true);
      setTimeout(() => setIsInputShaking(false), 500); // Reset after animation duration
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
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
    setStep(0); // Reset to Step 0 after submission
    onHide(); // Call the onHide function to close the modal
  };

  const [selectedDemands, setSelectedDemands] = useState<DemandProp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedDemands, setSuggestedDemands] = useState<DemandProp[]>([]);

  // Function to handle selecting a suggestion
  const handleSuggestionSelect = (suggestion: DemandProp) => {
    setSelectedDemands([...selectedDemands, suggestion]);
    setSearchQuery(''); // Clear the search input
    setSuggestedDemands([]); // Clear suggestions
  };

  // Function to handle removing a selected demand
  const handleRemoveDemand = (index: number) => {
    const updatedDemands = [...selectedDemands];
    updatedDemands.splice(index, 1);
    setSelectedDemands(updatedDemands);
  };

  // Initialize suggestedDemands with the latest 3 demands
  useEffect(() => {
    if (demands) {
      const sortedSuggestions = demands
        .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
        .slice(0, 3);
      setSuggestedDemands(sortedSuggestions);
    }
  }, [demands]);

  const updateSuggestions = (query: string) => {
    const matchingDemands = demands?.filter((demand) =>
      demand.id.toString().includes(query) ||
      demand.materialDescriptionCustomer.toLowerCase().includes(query.toLowerCase())
    ) || [];

    // Sort by changedAt in descending order
    const sortedSuggestions = matchingDemands
      .sort((a, b) => b.changedAt.localeCompare(a.changedAt));

    setSuggestedDemands(sortedSuggestions.slice(0, 3)); // Display up to 3 suggestions
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
          {step === 0 && (
            <div>
              <StepBreadcrumbs currentStep={step} />
              <br />
              <p>Welcome to the Capacity Group Wizard, this intuitive interface will simplify this task.
                Here, you'll effortlessly create capacity groups and seamlessly link them with demands.</p>
            </div>
          )}
          {step === 1 && (
            <Form>
              <Form.Group>
                <StepBreadcrumbs currentStep={step} />
                <br />
                <Form.Label className="control-label required-field-label">Capacity Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className={isInputShaking ? 'shake-input' : ''}
                />
              </Form.Group>
            </Form>
          )}
          {step === 2 && (
            <div>
              <StepBreadcrumbs currentStep={step} />
              <span>Demand Linkage</span>
              <Container className="mt-4">
                <Row>
                  <Col md={15}>
                    <FormControl
                      type="text"
                      placeholder="Search for demands..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        updateSuggestions(e.target.value);
                      }}
                    />
                    <br />
                    <ListGroup>
                      {suggestedDemands.length > 0 && (
                        <span>{searchQuery ? 'Results' : 'Suggestions'}: </span>
                      )}
                      {suggestedDemands.map((suggestion) => (
                        <ListGroup.Item key={suggestion.id} className="suggestion">
                          <Button
                            variant="outline-primary"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            {suggestion.id} - {suggestion.materialDescriptionCustomer} - {suggestion.materialNumberCustomer}
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
                {selectedDemands.length > 0 && (
                  <Row>
                    <Col md={6}>
                      <h3 className="mt-4">Selected Demands:</h3>
                      {selectedDemands.map((demand, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center">
                          {demand && (
                            <Button variant="danger" size="sm" onClick={() => handleRemoveDemand(index)}>
                              Remove
                            </Button>
                          )}
                          <div>
                            <p key={index}>
                              <strong>Description:</strong> {demand ? demand.materialDescriptionCustomer : 'Not selected'}
                              <br />
                              <strong>Customer:</strong> {demand ? demand.customer.companyName : 'Not selected'}
                              <br />
                              <strong>Material Number Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </Col>
                  </Row>
                )}
              </Container>
            </div>
          )}
          {step === 3 && (
            <div>
              <StepBreadcrumbs currentStep={step} />
              <span>Review and Submit</span>
              <br />
              <p>Group Name: {groupName}</p>
              <p>Selected Demands:</p>
              <Container className="mt-4">
                {selectedDemands.map((demand, index) => (
                  <Row key={index}>
                    <Col md={6}>
                      {demand && (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p>
                              <strong>Description:</strong> {demand ? demand.materialDescriptionCustomer : 'Not selected'}
                              <br />
                              <strong>Customer:</strong> {demand ? demand.customer.companyName : 'Not selected'}
                              <br />
                              <strong>Material Number Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                            </p>
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                ))}
              </Container>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step > 0 && (
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