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
import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaSearch } from 'react-icons/fa';
import Select from 'react-select';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import { DemandProp } from '../../interfaces/demand_interfaces';
import StepBreadcrumbs from './../common/StepsBreadCrumbs';

interface CapacityGroupWizardModalProps {
  show: boolean;
  onHide: () => void;
  checkedDemands: DemandProp[] | null;
  demands: DemandProp[] | null;
}

function CapacityGroupWizardModal({ show, onHide, checkedDemands, demands }: CapacityGroupWizardModalProps) {
  const [step, setStep] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [defaultActualCapacity, setDefaultActualCapacity] = useState('');
  const [defaultMaximumCapacity, setDefaultMaximumCapacity] = useState('');
  const [isNameInputShaking, setIsNameInputShaking] = useState(false);
  const [isActualCapacityInputShaking, setIsActualCapacityInputShaking] = useState(false);
  const [isMaximumCapacityShaking, setIsMaximumCapacityShaking] = useState(false);
  const context = useContext(CapacityGroupContext);

  const [selectedDemands, setSelectedDemands] = useState<DemandProp[]>([]);


  useEffect(() => {
    if (checkedDemands) {
      setSelectedDemands([...checkedDemands]);
    }
  }, [checkedDemands]);

  const nextStep = () => {

    //Validate if required fields are filled
    if (step === 1 && (!groupName || !defaultActualCapacity || !defaultMaximumCapacity)) {
      if (!groupName) {
        setIsNameInputShaking(true);
        setTimeout(() => setIsNameInputShaking(false), 500); // Reset after animation duration
      }
      if (!defaultActualCapacity) {
        setIsActualCapacityInputShaking(true);
        setTimeout(() => setIsActualCapacityInputShaking(false), 500);
      }
      if (!defaultMaximumCapacity) {
        setIsMaximumCapacityShaking(true);
        setTimeout(() => setIsMaximumCapacityShaking(false), 500);
      }
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

  // Function to handle removing a selected demand
  const handleRemoveDemand = (index: number) => {
    const updatedDemands = [...selectedDemands];
    updatedDemands.splice(index, 1);
    setSelectedDemands(updatedDemands);
  };
  const calculateEarliestAndLatestDates = (selectedDemands: DemandProp[]) => {
    let earliestDate: string = '';
    let latestDate: string = '';

    selectedDemands.forEach((demand) => {
      demand.demandSeries?.forEach((series) => {
        series.demandSeriesValues?.forEach((value) => {
          const dateStr: string = value?.calendarWeek || '';
          if (!earliestDate || dateStr < earliestDate) {
            earliestDate = dateStr;
          }
          if (!latestDate || dateStr > latestDate) {
            latestDate = dateStr;
          }
        });
      });
    });

    return { earliestDate, latestDate };
  };

  function areUnitMeasureIdsEqual(demands: DemandProp[]): boolean {
    if (demands.length <= 1) {
      return true; // If there's only one or zero demands, they are equal.
    }

    const firstUnitMeasureId = demands[0].unitMeasureId;
    return demands.every((demand) => demand.unitMeasureId.id === firstUnitMeasureId.id);
  }


  const handleSubmit = async () => {

    if (!context) {
      return;
    }
    // Calculate earliest and latest dates
    const { earliestDate, latestDate } = calculateEarliestAndLatestDates(selectedDemands);

    // Create a new capacity group
    const newCapacityGroup = {
      capacitygroupname: groupName,
      defaultActualCapacity: parseInt(defaultActualCapacity),
      defaultMaximumCapacity: parseInt(defaultMaximumCapacity),
      startDate: earliestDate,
      endDate: latestDate,
      customer: selectedDemands.length > 0 ? selectedDemands[0].customer.id : '', // Prefill with the customer ID of the first demand
      supplier: selectedDemands.length > 0 ? selectedDemands[0].supplier.id : '', // Prefill with the supplier ID of the first demand
      linkMaterialDemandIds: selectedDemands.map((demand) => demand.id), // IDs of linked demands
    };

    console.log(newCapacityGroup)

    // Call the createCapacityGroup function
    try {
      await context.createCapacityGroup(newCapacityGroup);

    } catch (error) {
      console.error('Error creating capacity group:', error);
    }

    // Reset form and close modal
    setGroupName('');
    setDefaultActualCapacity('');
    setDefaultMaximumCapacity('');
    setStep(0); // Reset to Step 0 after submission
    onHide(); // Call the onHide function to close the modal
  };


  const handleDefaultMaximumCapacityChange = (newValue: string) => {
    // Use a regular expression to allow only numbers
    const numericValue = newValue.replace(/[^0-9]/g, '');
    // Update the state with the numeric value
    setDefaultActualCapacity(numericValue);
    setDefaultMaximumCapacity(numericValue);
  };

  const handleDefaultActualCapacityChange = (newValue: string) => {
    // Use a regular expression to allow only numbers
    const numericValue = newValue.replace(/[^0-9]/g, '');
    // Update the state with the numeric value
    setDefaultActualCapacity(numericValue);
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
              <p>Welcome to the Capacity Group Wizard, this intuitive interface will simplify this task. <br />
                Here, you'll effortlessly create capacity groups and seamlessly link them with demands step-by-step.</p>
            </div>
          )}
          {step === 1 && (
            <Form>
              <Form.Group>
                <StepBreadcrumbs currentStep={step} />
                <center><h5>Group Details</h5></center>

                <Form.Label className="control-label required-field-label">Capacity Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className={isNameInputShaking ? 'shake-input' : ''}
                />
              </Form.Group>
              <br />

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="control-label required-field-label">Default Maximum Capacity</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Default Maximum Capacity"
                      value={defaultMaximumCapacity}
                      onChange={(e) => handleDefaultMaximumCapacityChange(e.target.value)}
                      required
                      className={isMaximumCapacityShaking ? 'shake-input' : ''}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="control-label required-field-label">Default Actual Capacity</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Default Maximum Capacity"
                      value={defaultActualCapacity}
                      onChange={(e) => handleDefaultActualCapacityChange(e.target.value)}
                      required
                      className={isActualCapacityInputShaking ? 'shake-input' : ''}
                    />
                  </Form.Group>
                </Col>
              </Row>


            </Form>
          )}
          {step === 2 && (
            <div>
              <StepBreadcrumbs currentStep={step} />
              <center><h5>Demand Linkage</h5></center>
              {areUnitMeasureIdsEqual(selectedDemands) ? (
                // No warning if unit measure IDs are equal
                null
              ) : (
                // Display a warning alert if unit measure IDs are not equal
                <Alert variant="warning">
                  Units of measure of selected demands are not equal.
                </Alert>
              )}
              <Container className="mt-4">
                <Select
                  options={demands?.filter(demand => {
                    // Filter out demands that are in checkedDemands or selectedDemands
                    return (
                      !checkedDemands?.some(checkedDemand => checkedDemand.id === demand.id) &&
                      !selectedDemands.some(selectedDemand => selectedDemand.id === demand.id)
                    );
                  }).map(demand => ({
                    value: demand,
                    label: `${demand.id} - ${demand.materialDescriptionCustomer} - ${demand.materialNumberCustomer}`
                  }))}
                  value={null} //Just so that we dont get stuck on the data that was selected
                  onChange={selectedOption => {
                    if (selectedOption) {
                      setSelectedDemands([...selectedDemands, selectedOption.value]);
                    }
                  }}
                  isSearchable
                  placeholder={<><FaSearch /> Search for demands...</>}
                />
                {selectedDemands.length > 0 && (
                  <Row>
                    <Col>
                      <h3 className="mt-4">Selected Demands:</h3>
                      {selectedDemands.map((demand, index) => (
                        <div key={index} className="d-flex mt-1 border rounded border-opacity-10 align-items-center">
                          {demand && (
                            <Button variant="danger" className="ms-3" size="sm" onClick={() => handleRemoveDemand(index)}>
                              Remove
                            </Button>
                          )}
                          <div className='ms-3 mt-2'>
                            <p key={index}>
                              <strong>Description:</strong> {demand ? demand.materialDescriptionCustomer : 'Not selected'}
                              <br />
                              <strong>Customer:</strong> {demand ? demand.customer.companyName : 'Not selected'}
                              <br />
                              <strong>Material Number Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                              <br />
                              <strong>Unit of Measure:</strong> {demand ? demand.unitMeasureId.id : 'Not selected'}
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
              <center><h5>Review and Submit</h5></center>
              <br />
              <div className="row mb-2">
                <div className="col-sm-3">
                  <h6 className="text-end">Capacity Group Name:</h6>
                </div>
                <div className="col-sm-9">
                  <span>{groupName}</span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3">
                  <h6 className="text-end">Maximum Capacity:</h6>
                </div>
                <div className="col-sm-9">
                  <span>{defaultMaximumCapacity}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="text-end">Actual Capacity:</h6>
                </div>
                <div className="col-sm-9">
                  <span>{defaultActualCapacity}</span>
                </div>
              </div>
              <br />
              <h5>Selected Demands:</h5>
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