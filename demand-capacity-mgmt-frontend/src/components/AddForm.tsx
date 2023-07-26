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
import { DemandContext } from '../contexts/DemandContextProvider';
import DemandCategoryContextProvider from '../contexts/DemandCategoryProvider';
import DemandCategoryOptions from './DemandCategoryOptions';
import CompanyContextProvider from '../contexts/CompanyContextProvider';
import CompanyOptions from './CompanyOptions';
import UnitsofMeasureContextContextProvider from '../contexts/UnitsOfMeasureContextProvider';
import UnitsOfMeasureOptions from './UnitsofMeasureOptions';
import {Demand} from '../interfaces/demand_interfaces'


const AddForm: React.FC = () => {
  const { createDemand } = useContext(DemandContext)!;

  const initialFormState: Demand = {
    id: '',
    materialDescriptionCustomer: '',
    materialNumberCustomer: '',
    materialNumberSupplier: '',
    customerId: '5d210fb8-260d-4190-9578-f62f9c459703', //Id do submiter
    supplierId: '',
    unitMeasureId: '',
    materialDemandSeries: {
      customerLocationId: 'string',
      expectedSupplierLocationId: [],
      demandCategoryId: '',
      demandSeriesValues: []
    }
  };

  const [formState, setFormState] = useState<Demand>(initialFormState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createDemand(formState);
    {/*resetForm();*/}
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

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
          [name]: value,
        },
      }));
    } else {
      setFormState((prevFormState) => ({
        ...prevFormState,
        [name]: value,
      }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formgridStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control 
            type="date"
            placeholder="Start Date"
            name="startDate"
            id="startDate"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={onInputChange}
            required
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridPassword">
        <Form.Label>End Date</Form.Label>
        <Form.Control 
            type="date"
            placeholder="End Date"
            name="endDate"
            id="endDate"
            onChange={onInputChange}
            pattern="\d{4}-\d{2}-\d{2}"
            required
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
      <Form.Group as={Col} >
      <Form.Label>Unit of Measure</Form.Label>
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
    <Form.Group className="mb-3">
      <Form.Label>Supplier</Form.Label>
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

    <Form.Group className="mb-3">
      <Form.Label>Demand Category</Form.Label>
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

      <Form.Group className="mb-3">
      <Form.Label>Material Number Customer</Form.Label>
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

      <Form.Group className="mb-3">
      <Form.Label>Material Number Supplier</Form.Label>
        <Form.Control
          type="text"
          placeholder="Material Number"
          id="materialNumberSupplier"
          name="materialNumberSupplier"
          value={formState.materialNumberSupplier}
          onChange={onInputChange}
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-3">
      <Form.Label>Description</Form.Label>
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
