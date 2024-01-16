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
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaSearch } from 'react-icons/fa';
import { LuStar } from 'react-icons/lu';
import Select from 'react-select';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import { FavoritesContext } from '../../contexts/FavoritesContextProvider';
import { UnitsofMeasureContext } from '../../contexts/UnitsOfMeasureContextProvider';
import { useUser } from '../../contexts/UserContext';
import CustomOption from '../../interfaces/customoption_interface';
import { DemandProp } from '../../interfaces/demand_interfaces';
import { FavoriteType } from '../../interfaces/favorite_interfaces';
import { LoadingCustomMessage } from '../common/LoadingMessages';
import StepBreadcrumbs from './../common/StepsBreadCrumbs';

interface CapacityGroupWizardModalProps {
  show: boolean;
  onHide: () => void;
  checkedDemands: DemandProp[] | null;
  demands: DemandProp[] | null;
}

function CapacityGroupWizardModal({ show, onHide, checkedDemands, demands }: CapacityGroupWizardModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [defaultActualCapacity, setDefaultActualCapacity] = useState('');
  const [defaultMaximumCapacity, setDefaultMaximumCapacity] = useState('');
  const [isNameInputShaking, setIsNameInputShaking] = useState(false);
  const [isActualCapacityInputShaking, setIsActualCapacityInputShaking] = useState(false);
  const [isMaximumCapacityShaking, setIsMaximumCapacityShaking] = useState(false);
  const [selectedDemands, setSelectedDemands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const context = useContext(CapacityGroupContext);
  const { fetchFavoritesByType } = useContext(FavoritesContext)!;

  const [createdgroupid, setCreatedgroupid] = useState('');


  // Get the unitsofmeasure context
  const unitsofmeasureContext = useContext(UnitsofMeasureContext);

  // Function to get the unit measure description based on id
  const getUnitMeasureDescription = (unitMeasureId: string) => {
    const unitMeasure = unitsofmeasureContext?.unitsofmeasure.find(unit => unit.id === unitMeasureId);
    return unitMeasure ? `${unitMeasure.dimension} - ${unitMeasure.description} (${unitMeasure.unSymbol})` : 'N/A';
  };

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
    let earliestDate: string | null = null;
    let latestDate: string | null = null;

    selectedDemands.forEach((demand) => {
      // Check startDate and endDate for potential earliestDate and latestDate
      if (demand.startDate) {
        earliestDate = earliestDate
          ? new Date(demand.startDate) < new Date(earliestDate)
            ? demand.startDate
            : earliestDate
          : demand.startDate;
      }
      if (demand.endDate) {
        latestDate = latestDate
          ? new Date(demand.endDate) > new Date(latestDate)
            ? demand.endDate
            : latestDate
          : demand.endDate;
      }

      // If demandSeries is present, calculate earliestDate and latestDate from demandSeries
      if (demand.demandSeries) {
        demand.demandSeries.forEach((series) => {
          series.demandSeriesValues?.forEach((value) => {
            const dateStr: string = value?.calendarWeek || '';
            if (dateStr) {
              earliestDate = earliestDate
                ? new Date(dateStr) < new Date(earliestDate)
                  ? dateStr
                  : earliestDate
                : dateStr;

              latestDate = latestDate
                ? new Date(dateStr) > new Date(latestDate)
                  ? dateStr
                  : latestDate
                : dateStr;
            }
          });
        });
      }
    });

    // Use a default value if earliestDate or latestDate is still null
    const defaultDate: string = "1970-01-01"; // Replace with an appropriate default date
    return { earliestDate: earliestDate || defaultDate, latestDate: latestDate || defaultDate };
  };

  function areUnitMeasureIdsEqual(demands: DemandProp[]): boolean {
    if (demands.length <= 1) {
      return true; // If there's only one or zero demands, they are equal.
    }

    const firstUnitMeasureId = demands[0].unitMeasureId?.id ?? demands[0].unitMeasureId;
    return demands.every((demand) => {
      const demandId = demand.unitMeasureId?.id ?? demand.unitMeasureId;
      return demandId === firstUnitMeasureId;
    });
  }

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!context) {
      setIsLoading(false);
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
      customer: selectedDemands.length > 0 ? selectedDemands[0].customer.id : '',
      supplier: user?.companyID || '',
      linkMaterialDemandIds: selectedDemands.map((demand) => demand.id),
    };

    try {
      const response = await context.createCapacityGroup(newCapacityGroup);
      setIsSuccess(true);
      setCreatedgroupid(response?.capacityGroupId || '');
      // Reset form and close modal after a successful submission
      setGroupName('');
      setDefaultActualCapacity('');
      setDefaultMaximumCapacity('');
    } catch (error) {
      console.error('Error creating capacity group:', error);
    } finally {
      setIsLoading(false);
    }
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

  const [options, setOptions] = useState<any[]>([]); // State to store options for Creatable component

  const fetchFavoritesByTypeRef = useRef(fetchFavoritesByType);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const favoriteIdsSet = new Set<string>(); // Set to store unique favorite material demand IDs
      const fetchFavoritesByType = fetchFavoritesByTypeRef.current;
      let materialDemandOptions: any[] = [];

      // Fetch material demands from favorites
      const favoritesResponse = await fetchFavoritesByType(FavoriteType.MATERIAL_DEMAND);
      const favoriteMaterialDemands = favoritesResponse?.materialDemands || [];

      // Filter and map favorite material demands to options, ensuring uniqueness based on IDs
      const favoriteOptions = favoriteMaterialDemands
        .filter((md: any) => {
          if (favoriteIdsSet.has(md.id)) {
            return false; // Skip duplicate favorites
          }
          favoriteIdsSet.add(md.id); // Add favorite ID to set
          return true; // Include only unique favorites
        })
        .map((md: any) => {
          const label = (
            <div>
              <LuStar size={12} className="text-warning" />  {md.materialNumberCustomer || 'N/A'} - {md.materialNumberSupplier || 'N/A'} - {md.materialDescriptionCustomer || 'N/A'}
            </div>
          );
          return {
            value: md,
            label: label,
          };
        });

      // Fetch material demands from demands prop
      const demandMaterialDemands = demands || [];

      // Filter demand material demands to exclude those with IDs present in favorites
      const filteredDemandOptions = demandMaterialDemands.filter((md: any) => {
        // Exclude demand if its ID is present in favorites
        if (favoriteIdsSet.has(md.id)) {
          return false;
        }
        // Exclude demand if its linkStatus is neither 'TODO' nor 'UNLINKED'
        if (md.linkStatus !== 'TODO' && md.linkStatus !== 'UNLINKED') {
          return false;
        }
        // else
        return true;
      });

      // Map demand material demands to options
      const demandOptions = filteredDemandOptions.map((md: any) => {
        const label = (
          <div>
            {md.materialNumberCustomer || 'N/A'} - {md.materialNumberSupplier || 'N/A'} - {md.materialDescriptionCustomer || 'N/A'}
          </div>
        );
        return {
          value: md,
          label: label,
        };
      });

      // Combine favorite options and demand options
      materialDemandOptions = [...favoriteOptions, ...demandOptions];

      setOptions(materialDemandOptions); // Update options state with combined material demands
    } catch (error) {
      console.error('Error fetching filtered capacity groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [demands, fetchFavoritesByTypeRef]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          {isLoading && <> <LoadingCustomMessage message='Please Wait..' /></>}
          {isSuccess ? (
            <div className="alert alert-success" role="alert">
              Capacity group created !
              It can now be found on the <a href='/' onClick={() => window.open(`/details/${createdgroupid}`, '_blank')}> Capacity group</a> list.
              You can now close this prompt.
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <StepBreadcrumbs welcome={true} maxSteps={3} currentStep={step} />
                  <br />
                  <p>
                    Welcome to the Capacity Group Wizard, this intuitive interface will simplify this task. <br />
                    Here, you'll effortlessly create capacity groups and seamlessly link them with demands step-by-step.
                  </p>
                </div>
              )}
              {step === 1 && (
                <Form>
                  <Form.Group>
                    <StepBreadcrumbs welcome={true} maxSteps={3} currentStep={step} />
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
                  <StepBreadcrumbs welcome={true} maxSteps={3} currentStep={step} />
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
                      options={options}
                      value={null} //Just so that we don't get stuck on the data that was selected
                      onChange={selectedOption => {
                        if (selectedOption) {
                          setSelectedDemands([...selectedDemands, selectedOption.value]);
                        }
                      }}
                      isSearchable
                      placeholder={<><FaSearch /> Search for demands...</>}
                      components={{
                        Option: CustomOption, // Use the CustomOption component for rendering options
                      }}
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
                                  <strong>Customer:</strong> {demand?.customer?.companyName || 'Not selected'}
                                  <br />
                                  <strong>Material Number Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                                  <br />
                                  <strong>Unit of Measure:</strong> <span>{getUnitMeasureDescription(demand.unitMeasureId?.id ?? demand.unitOfMeasure)}</span>
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
                  <StepBreadcrumbs welcome={true} maxSteps={3} currentStep={step} />
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
                                  <strong>Customer:</strong> {demand?.customer?.companyName || 'Not selected'}
                                  <br />
                                  <strong>Material Number Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                                  <br />
                                  <strong>Unit of Measure:</strong> {getUnitMeasureDescription(demand.unitMeasureId?.id ?? demand.unitOfMeasure)}
                                </p>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Container>
                </div>
              )}</>)}
        </Modal.Body>
        <Modal.Footer>
          {step === 0 && (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 1 && (
            <>
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button variant="primary" onClick={nextStep}>
                Next
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button variant="primary" onClick={nextStep}>
                Next
              </Button>
            </>
          )}
          {step === 3 && !isSuccess && (
            <>
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </>
          )}
          {isSuccess && (
            <>
              <Button variant="primary" onClick={() => window.open(`/details/${createdgroupid}`, '_blank')}>
                Go to Capacity Group
              </Button>
              <Button variant="secondary" onClick={onHide}>
                Close
              </Button>
            </>
          )}
        </Modal.Footer>


      </Modal >
    </>
  );
}

export default CapacityGroupWizardModal;