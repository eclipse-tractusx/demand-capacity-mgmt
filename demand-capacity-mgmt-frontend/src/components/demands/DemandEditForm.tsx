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

import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Col,Row} from 'react-bootstrap';
import { DemandContext} from '../../contexts/DemandContextProvider';
import { DemandProp} from '../../interfaces/demand_interfaces';
import CompanyOptions from '../CompanyOptions';
import DemandCategoryOptions from './DemandCategoryOptions';
import UnitsOfMeasureOptions from '../UnitsofMeasureOptions';
import { FiSave } from 'react-icons/fi';

interface EditFormProps {
  theDemand: DemandProp;
}

const EditForm: React.FC<EditFormProps> = ({ theDemand }) => {
  const { updateDemand } = useContext(DemandContext)!;
  const [demand, setDemand] = useState<DemandProp>(theDemand);

  useEffect(() => {
    setDemand(theDemand);
  }, [theDemand]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    {/*updateDemand(demand);*/} //We need to map a demand prop to a demand
  };

  return (

    <Form>
    <Row className="mb-3">
      <Form.Group className="form-group required" as={Col}>
        <Form.Label className="control-label required-field-label">Start Date</Form.Label>
        <Form.Control
          type="date"
          placeholder="Start Date"
          name="startDate"
          id="startDate"
          defaultValue={demand.demandSeries?.[0]?.demandSeriesValues?.[0]?.calendarWeek?.split('T')[0] || ''}
          readOnly
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
          defaultValue={demand.demandSeries?.[0].demandSeriesValues[demand.demandSeries[0].demandSeriesValues.length - 1]?.calendarWeek?.split('T')[0]}
          readOnly
        />
        <Form.Control.Feedback type="invalid">End Date has to be a Monday after Start Date.</Form.Control.Feedback>
      </Form.Group>
    </Row>
      
    <Row className="mb-3">
          <Form.Group className="form-group required" as={Col}>
            <Form.Label className="control-label required-field-label">Unit of Measure</Form.Label>
              <Form.Select
                name="unitMeasureId"
                id="unitMeasureId"
                required
              >
                 <UnitsOfMeasureOptions selectedUnitMeasureId={demand.unitMeasureId.id} />
              </Form.Select>
          </Form.Group>
      </Row>
    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Supplier</Form.Label>
      <Form.Select
        aria-label="Default select example"
        name="supplierId"
        id="supplierId"
        required
      >
          <CompanyOptions selectedCompanyName={demand.supplier.companyName} />
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Demand Category</Form.Label>
      <Form.Select
        aria-label="Default select example"
        placeholder="Demand Category"
        name="demandCategoryId"
        id="demandCategoryId"
        required
      >
          <DemandCategoryOptions selectedDemandCategoryId={demand.demandSeries?.[0]?.demandCategory?.id || ''}/>
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Material Number Customer</Form.Label>
      <Form.Control
        type="text"
        placeholder="Material Number"
        id="materialNumberCustomer"
        name="materialNumberCustomer"
        defaultValue={demand.materialNumberCustomer}
        required
      />
    </Form.Group>

    <Form.Group className="mb-3 required">
      <Form.Label>Material Number Supplier</Form.Label>
      <Form.Control
        type="text"
        placeholder="Material Number"
        id="materialNumberSupplier"
        name="materialNumberSupplier"
        defaultValue={demand.materialNumberSupplier}
      />
    </Form.Group>

    <Form.Group className="mb-3 form-group required">
      <Form.Label className="control-label required-field-label">Description</Form.Label>
      <Form.Control
        type="text"
        placeholder="Description"
        id="materialDescriptionCustomer"
        name="materialDescriptionCustomer"
        defaultValue={demand.materialDescriptionCustomer}
        required
      />
    </Form.Group>

    <Button variant="primary" type="submit">
              <FiSave/>  Save Changes
      </Button>
  </Form>



  );
};

export default EditForm;
