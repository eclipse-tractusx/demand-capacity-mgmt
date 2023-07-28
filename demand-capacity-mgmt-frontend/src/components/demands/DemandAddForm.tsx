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

import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Row,Col } from 'react-bootstrap';
import { DemandContext } from '../../contexts/DemandContextProvider';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import DemandCategoryOptions from './DemandCategoryOptions';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';
import CompanyOptions from '../CompanyOptions';
import UnitsofMeasureContextContextProvider from '../../contexts/UnitsOfMeasureContextProvider';
import UnitsOfMeasureOptions from '../UnitsofMeasureOptions';
import {Demand} from '../../interfaces/demand_interfaces';
import '../../App.css';

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

const AddForm: React.FC = () => {
  const { createDemand } = useContext(DemandContext)!;

  const initialFormState: Demand = {
    id: '',
    materialDescriptionCustomer: '',
    materialNumberCustomer: '',
    materialNumberSupplier: '',
    startDate:'',
    endDate:'',
    customerId: '5d210fb8-260d-4190-9578-f62f9c459703', //Id do submiter TODO
    supplierId: '',
    unitMeasureId: '',
    materialDemandSeries: {
      customerLocationId: '5d210fb8-260d-4190-9578-f62f9c459703', //In this case im the customer so its my ID
      expectedSupplierLocationId: [],
      demandCategoryId: '',
      demandSeriesValues: []
    }
  };

  const [formState, setFormState] = useState<Demand>(initialFormState);
  const [demandSeriesValues, setDemandSeriesValues] = useState<{ calendarWeek: string; demand: number }[]>([]);

  // Utility function to calculate the Mondays between the start and end dates
  const calculateDemandSeriesValues = (startDate: Date, endDate: Date) => {
    const mondays = getMondaysBetweenDates(startDate, endDate);
    const values = mondays.map((monday) => ({
      calendarWeek: monday,
      demand: 0,
    }));
    return values;
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const startDateObj = new Date(formState.startDate);
    const endDateObj = new Date(formState.endDate);
    if (startDateObj && endDateObj) {
      const calculatedValues = calculateDemandSeriesValues(startDateObj, endDateObj);
      // Call createDemand after setting the demandSeriesValues
      createDemand({ ...formState, materialDemandSeries: { ...formState.materialDemandSeries, demandSeriesValues: calculatedValues } });
    }
  };


{/*  const resetForm = () => {
    setFormState(initialFormState);
  };*/}

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value
    }));
  };

  const onInputChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'supplierId') {
      setFormState((prevFormState) => ({
        ...prevFormState,
        supplierId: value, // Update supplierId in the top-level formState
        materialDemandSeries: {
          ...prevFormState.materialDemandSeries,
          expectedSupplierLocationId: [value], // Fill the expectedSupplierLocationId array with the value of supplierId
        },
      }));
    } else if (name === 'demandCategoryId') {
      setFormState((prevFormState) => ({
        ...prevFormState,
        materialDemandSeries: {
          ...prevFormState.materialDemandSeries,
          demandCategoryId: value, // Ensure demandCategoryId is set properly
        },
      }));
    } else {
      setFormState((prevFormState) => ({
        ...prevFormState,
        [name]: value,
      }));
    }
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
    const selectedDate = new Date(e.target.value);
    setStartDateValid(selectedDate.getDay() === 1);
    setEndDateValid(true);
    setFormState((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };
  
  const onEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setEndDateValid(selectedDate.getDay() === 1 && selectedDate >= new Date(formState.startDate));
    setFormState((prevFormState) => ({
      ...prevFormState,
      [e.target.name]: e.target.value,
    }));
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group className="form-group required"as={Col}>
          <Form.Label className="control-label required-field-label" >Start Date</Form.Label>
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
          <Form.Control.Feedback type="invalid">
            Please select a Monday for the Start Date.
          </Form.Control.Feedback>
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
            required
            isInvalid={!endDateValid}
          />
          <Form.Control.Feedback type="invalid">
            End Date has to be a Monday after Start Date.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
      <Form.Group className="form-group required" as={Col} >
      <Form.Label className="control-label required-field-label">Unit of Measure</Form.Label>
        <Form.Select
                  name="unitMeasureId"
                  id="unitMeasureId"
                  onChange={onInputChangeSelect}
                  value={formState.unitMeasureId}
                  required>
                    <UnitsofMeasureContextContextProvider>
                      <UnitsOfMeasureOptions/>
                    </UnitsofMeasureContextContextProvider>
        </Form.Select>
      </Form.Group>
    </Row>
    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Supplier</Form.Label>
      <Form.Select aria-label="Default select example"
                  name="supplierId"
                  id="supplierId"
                  onChange={onInputChangeSelect}
                  value={formState.supplierId}
                  required>
                    <CompanyContextProvider>
                      <CompanyOptions/>
                    </CompanyContextProvider>

        </Form.Select>
      </Form.Group>

    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Demand Category</Form.Label>
      <Form.Select aria-label="Default select example"
                  placeholder="Demand Category"
                  name="demandCategoryId"
                  id="demandCategoryId"
                  value={formState.materialDemandSeries.demandCategoryId} 
                  onChange={onInputChangeSelect}
                  required>
                    <DemandCategoryContextProvider>
                      <DemandCategoryOptions/>
                    </DemandCategoryContextProvider>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label"l>Material Number Customer</Form.Label>
        <Form.Control
          type="text"
          placeholder="Material Number"
          id="materialNumberCustomer"
          name="materialNumberCustomer"
          value={formState.materialNumberCustomer}
          onChange={onInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3 required  ">
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
      <Form.Label className="control-label required-field-label"l>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Description"
          id="materialDescriptionCustomer"
          name="materialDescriptionCustomer"
          value={formState.materialDescriptionCustomer}
          onChange={onInputChange}
          required
        />
      </Form.Group>


      <Button variant="success" type="submit">
        Add New Demand  
      </Button>
    </Form>
  );
};

export default AddForm;
