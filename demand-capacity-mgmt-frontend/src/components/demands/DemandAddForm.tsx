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

import React, { ChangeEvent, FormEvent, useCallback, useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import { DemandContext } from '../../contexts/DemandContextProvider';
import UnitsofMeasureContextContextProvider from '../../contexts/UnitsOfMeasureContextProvider';
import { Demand } from '../../interfaces/demand_interfaces';
import CompanyOptions from '../common/CompanyOptions';
import UnitsOfMeasureOptions from '../common/UnitsofMeasureOptions';
import DemandCategoryOptions from './DemandCategoryOptions';

type AddFormProps = {
  fetchDemandProps: () => void; // Function to fetch demands
};

const getMondaysBetweenDates = (startDate: Date, endDate: Date): string[] => {
  const mondays: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    if (current.getDay() === 1) {
      // Monday has index 1 in JS (0 is Sunday, 1 is Monday, etc.)
      const formattedDate = current.toISOString().slice(0, 10);
      mondays.push(formattedDate);
    }

    current.setDate(current.getDate() + 1);
  }

  return mondays;
};

const useHandleSubmit = (initialFormState: Demand) => {
  const { createDemand } = useContext(DemandContext)!;
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = useCallback(async (formState: Demand) => {

    // Utility function to calculate the Mondays between the start and end dates
    const calculateDemandSeriesValues = (startDate: Date, endDate: Date) => {
      const mondays = getMondaysBetweenDates(startDate, endDate);
      const values = mondays.map((monday) => ({
        calendarWeek: monday,
        demand: 0,
      }));
      return values;
    };
    const startDateInput = document.querySelector<HTMLInputElement>('#startDate');
    const endDateInput = document.querySelector<HTMLInputElement>('#endDate');

    if (startDateInput && endDateInput) {
      const startDateObj = new Date(startDateInput.value);
      const endDateObj = new Date(endDateInput.value);

      const calculatedValues = calculateDemandSeriesValues(startDateObj, endDateObj);

      // Build the materialDemandSeries object
      const materialDemandSeries = {
        customerLocationId: formState.customerId,
        expectedSupplierLocationId: [formState.supplierId],
        demandCategoryId: formState.materialDemandSeries[0].demandCategoryId,
        demandSeriesValues: calculatedValues,
      };

      // Build the final demand object
      const demand = {
        id: formState.id,
        materialDescriptionCustomer: formState.materialDescriptionCustomer,
        materialNumberCustomer: formState.materialNumberCustomer,
        materialNumberSupplier: formState.materialNumberSupplier,
        customerId: formState.customerId,
        supplierId: formState.supplierId,
        unitMeasureId: formState.unitMeasureId,
        materialDemandSeries: [materialDemandSeries], // Wrap materialDemandSeries in an array
      };

      try {
        setSubmissionStatus('submitting'); // Set the submission status to 'submitting' while the API call is in progress

        await createDemand(demand);
        setSubmissionStatus('submitted'); // Set the submission status to 'submitted' if the API call is successful
      } catch (error) {
        console.error('Error creating demand:', error);
        setSubmissionStatus('idle'); // Set the submission status back to 'idle' if the API call fails
        // Handle error if needed
      }
    }
  }, [createDemand]);

  return { submissionStatus, handleSubmit };
};

const AddForm: React.FC<AddFormProps> = () => {
  const initialFormState: Demand = {
    id: '',
    materialDescriptionCustomer: '',
    materialNumberCustomer: '',
    materialNumberSupplier: '',
    customerId: 'e1abe001-4e24-471f-9b66-a4b3408e3bf6', //This is my current login ID
    supplierId: '',
    unitMeasureId: '',
    materialDemandSeries: [
      {
        customerLocationId: 'e1abe001-4e24-471f-9b66-a4b3408e3bf6',  //This is my current login ID
        expectedSupplierLocationId: [],
        demandCategoryId: '',
        demandSeriesValues: [],
      },
    ],
  };

  const [formState, setFormState] = useState<Demand>(initialFormState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state to handle the success message
  const { submissionStatus, handleSubmit } = useHandleSubmit(initialFormState);


  const [unitMeasureError, setUnitMeasureError] = useState<string>('');
  const [supplierError, setSupplierError] = useState<string>('');
  const [demandCategoryError, setDemandCategoryError] = useState<string>('');
  const [materialNumberCustomerError, setMaterialNumberCustomerError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();


    //We do this since the startDate and end date are not on the fromstate, but used to generate demands.
    const startDateInput = document.querySelector<HTMLInputElement>('#startDate');
    const endDateInput = document.querySelector<HTMLInputElement>('#endDate');

    const { supplierId, unitMeasureId, materialDemandSeries, materialDescriptionCustomer, materialNumberCustomer } = formState;

    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach((errorMsg) => {
      errorMsg.textContent = '';
    });

    if (!startDateInput?.value) {
      console.error('Start date is required.');
      startDateInput?.classList.add('invalid-input');
      return;
    }

    if (!endDateInput?.value) {
      console.error('End date is required.');
      endDateInput?.classList.add('invalid-input');
      return;
    }

    if (!unitMeasureId) {
      setUnitMeasureError('Unit of measure is required.');
      return;
    } else {
      setUnitMeasureError('');
    }

    // Validate Supplier
    if (!supplierId) {
      setSupplierError('Supplier is required.');
      return;
    } else {
      setSupplierError('');
    }

    // Validate Demand Category
    if (!materialDemandSeries?.[0]?.demandCategoryId) {
      setDemandCategoryError('Demand category is required.');
      return;
    } else {
      setDemandCategoryError('');
    }

    // Validate Material Number Customer
    if (!materialNumberCustomer) {
      setMaterialNumberCustomerError('Material Number Customer is required.');
      return;
    } else {
      setMaterialNumberCustomerError('');
    }

    // Validate Description
    if (!materialDescriptionCustomer) {
      setDescriptionError('Description is required.');
      return;
    } else {
      setDescriptionError('');
    }

    await handleSubmit(formState);
    setShowSuccessMessage(true);
  }


  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  const onInputChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormState((prevFormState) => {
      if (name === 'demandCategoryId') {
        return {
          ...prevFormState,
          materialDemandSeries: [
            {
              ...prevFormState.materialDemandSeries[0],
              demandCategoryId: value,
            },
          ],
        };
      } else {
        return {
          ...prevFormState,
          [name]: value,
        };
      }
    });
  }

  const handleUnitMeasureChange = (value: string) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      unitMeasureId: value,
    }));
  };

  const handleSupplierChange = (value: string) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      supplierId: value,
    }));
  };

  const getNextMonday = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    return nextMonday;
  };

  const [startDateValid, setStartDateValid] = useState(true);
  const [endDateValid, setEndDateValid] = useState(true);

  const onStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = new Date(e.target.value);
    setStartDateValid(selectedStartDate.getDay() === 1);
    setEndDateValid(true);
    setFormState((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };

  const onEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = new Date(e.target.value);
    setEndDateValid(selectedEndDate.getDay() === 1 && selectedEndDate >= new Date(e.target.value));
    setFormState((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {showSuccessMessage && submissionStatus === 'submitted' ? (
        <div className="alert alert-success" role="alert">
          Material demand has been created!
          Please reach to the <a href='#overview'>Overview</a> to adjust the demand.
        </div>
      ) : (
        <Form>
          <Row className="mb-3">
            <Form.Group className="form-group required" as={Col}>
              <Form.Label className="control-label required-field-label">Start Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Start Date"
                name="startDate"
                id="startDate"
                pattern="\d{4}-\d{2}-\d{2}"
                min={getNextMonday().toISOString().slice(0, 10)}
                onChange={onStartDateChange}
                required
                isInvalid={!startDateValid}
              />
              <Form.Control.Feedback type="invalid">Please select a Monday for the Start Date.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="form-group required" as={Col}>
              <Form.Label className="control-label required-field-label">End Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="End Date"
                name="endDate"
                id="endDate"
                pattern="\d{4}-\d{2}-\d{2}"
                min={getNextMonday().toISOString().slice(0, 10)}
                onChange={onEndDateChange}
                isInvalid={!endDateValid}
              />
              <Form.Control.Feedback type="invalid">End Date has to be a Monday after Start Date.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group className="form-group required" as={Col}>
              <Form.Label className="control-label required-field-label">Unit of Measure</Form.Label>
              <UnitsofMeasureContextContextProvider>
                <UnitsOfMeasureOptions selectedUnitMeasureId={formState.unitMeasureId} onChange={handleUnitMeasureChange} />
              </UnitsofMeasureContextContextProvider>
              <div className="invalid-feedback">{unitMeasureError}</div>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3 form-group required">
            <Form.Label className="control-label required-field-label">Supplier</Form.Label>
            <CompanyContextProvider>
              <CompanyOptions selectedCompanyName={formState.supplierId} onChange={handleSupplierChange} />
            </CompanyContextProvider>
            <div className="invalid-feedback">{supplierError}</div>
          </Form.Group>

          <Form.Group className="mb-3 form-group required">
            <Form.Label className="control-label required-field-label">Demand Category</Form.Label>
            <Form.Select
              aria-label="Default select example"
              placeholder="Demand Category"
              name="demandCategoryId"
              id="demandCategoryId"
              value={formState.materialDemandSeries[0].demandCategoryId}
              onChange={onInputChangeSelect}
              required
            >
              <DemandCategoryContextProvider>
                <DemandCategoryOptions selectedDemandCategoryId='' />
              </DemandCategoryContextProvider>
            </Form.Select>
            <div className="invalid-feedback">{demandCategoryError}</div>
          </Form.Group>

          <Form.Group className="mb-3 form-group required">
            <Form.Label className="control-label required-field-label">Material Number Customer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Material Number"
              id="materialNumberCustomer"
              name="materialNumberCustomer"
              value={formState.materialNumberCustomer}
              onChange={onInputChange}
              required
            />
            <div className="invalid-feedback">{materialNumberCustomerError}</div>
          </Form.Group>

          <Form.Group className="mb-3 required">
            <Form.Label>Material Number Supplier</Form.Label>
            <Form.Control
              type="text"
              placeholder="Material Number"
              id="materialNumberSupplier"
              name="materialNumberSupplier"
              value={formState.materialNumberSupplier}
              onChange={onInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 form-group required">
            <Form.Label className="control-label required-field-label">Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              id="materialDescriptionCustomer"
              name="materialDescriptionCustomer"
              value={formState.materialDescriptionCustomer}
              onChange={onInputChange}
              required
            />
            <div className="invalid-feedback">{descriptionError}</div>
          </Form.Group>

          <Button variant="primary" onClick={handleFormSubmit} disabled={submissionStatus === 'submitting'}>
            {submissionStatus === 'submitting' ? 'Adding...' : 'Add New Demand'}
          </Button>
        </Form>
      )}
    </>
  );
};

export default AddForm;
