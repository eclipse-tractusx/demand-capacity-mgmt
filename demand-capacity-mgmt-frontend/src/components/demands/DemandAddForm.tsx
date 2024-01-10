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
import { useUser } from '../../contexts/UserContext';
import { Demand } from '../../interfaces/demand_interfaces';
import { getMondaysBetweenDates, getNextMondayfromToday } from '../../util/WeeksUtils';
import CompanyOptions from '../common/CompanyOptions';
import UnitsOfMeasureOptions from '../common/UnitsofMeasureOptions';
import DemandCategoryOptions from './DemandCategoryOptions';

type AddFormProps = {
  fetchDemandProps: () => void; // Function to fetch demands
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
        materialDemandSeries: [materialDemandSeries],
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
  const { user } = useUser();
  const initialFormState: Demand = {
    id: '',
    materialDescriptionCustomer: '',
    materialNumberCustomer: '',
    materialNumberSupplier: '',
    customerId: user?.companyID || '',
    supplierId: '',
    unitMeasureId: '',
    materialDemandSeries: [
      {
        customerLocationId: user?.companyID || '',
        expectedSupplierLocationId: [],
        demandCategoryId: '',
        demandSeriesValues: [],
      },
    ],
  };

  const [formState, setFormState] = useState<Demand>(initialFormState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { submissionStatus, handleSubmit } = useHandleSubmit(initialFormState);

  const [datesError, setDatesError] = useState<string>('');
  const [unitMeasureError, setUnitMeasureError] = useState<string>('');
  const [supplierError, setSupplierError] = useState<string>('');
  const [demandCategoryError, setDemandCategoryError] = useState<string>('');
  const [materialNumberCustomerError, setMaterialNumberCustomerError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const startDateInput = document.querySelector<HTMLInputElement>('#startDate');
    const endDateInput = document.querySelector<HTMLInputElement>('#endDate');

    const { supplierId, unitMeasureId, materialDemandSeries, materialDescriptionCustomer, materialNumberCustomer } = formState;

    const errors = {
      startDate: !startDateInput?.value ? 'Start date is required.' : '',
      endDate: !endDateInput?.value ? 'End date is required.' : '',
      unitMeasure: !unitMeasureId ? 'Unit of measure is required.' : '',
      supplier: !supplierId ? 'Supplier is required.' : '',
      demandCategory: !materialDemandSeries?.[0]?.demandCategoryId ? 'Demand category is required.' : '',
      materialNumberCustomer: !materialNumberCustomer ? 'Material Number Customer is required.' : '',
      description: !materialDescriptionCustomer ? 'Description is required.' : ''
    };

    // Set error messages
    setDatesError(errors.startDate || errors.endDate);
    setUnitMeasureError(errors.unitMeasure);
    setSupplierError(errors.supplier);
    setDemandCategoryError(errors.demandCategory);
    setMaterialNumberCustomerError(errors.materialNumberCustomer);
    setDescriptionError(errors.description);

    // Check for validation failures
    const failedValidation = Object.values(errors).some(error => error !== '');
    if (failedValidation) {
      return;
    }

    await handleSubmit(formState);
    setShowSuccessMessage(true);
  };



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
                min={getNextMondayfromToday().toISOString().slice(0, 10)}
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
                min={getNextMondayfromToday().toISOString().slice(0, 10)}
                onChange={onEndDateChange}
                isInvalid={!endDateValid}
              />
              <Form.Control.Feedback type="invalid">End Date has to be a Monday after Start Date.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row style={{ margin: '-15px 0 15px auto' }}><div className="error-message" >{datesError}</div></Row>
          <Row className="mb-3">
            <Form.Group className="form-group required" as={Col}>
              <Form.Label className="control-label required-field-label">Unit of Measure</Form.Label>
              <UnitsofMeasureContextContextProvider>
                <UnitsOfMeasureOptions selectedUnitMeasureId={formState.unitMeasureId} onChange={handleUnitMeasureChange} />
              </UnitsofMeasureContextContextProvider>
              <div className="error-message">{unitMeasureError}</div>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3 form-group required">
            <Form.Label className="control-label required-field-label">Supplier</Form.Label>
            <CompanyContextProvider>
              <CompanyOptions selectedCompanyName={formState.supplierId} onChange={handleSupplierChange} />
            </CompanyContextProvider>
            <div className="error-message">{supplierError}</div>
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
            <div className="error-message">{demandCategoryError}</div>
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
            <div className="error-message">{materialNumberCustomerError}</div>
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
            <div className="error-message">{descriptionError}</div>
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
