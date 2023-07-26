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
import { DemandContext} from '../contexts/DemandContextProvider';
import { Demand } from '../interfaces/demand_interfaces';

interface EditFormProps {
  theDemand: Demand;
}

const EditForm: React.FC<EditFormProps> = ({ theDemand }) => {
  const { updateDemand } = useContext(DemandContext)!;

  const [demand, setDemand] = useState<Demand>(theDemand);

  useEffect(() => {
    setDemand(theDemand);
  }, [theDemand]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (demand.requiredValue <= 0) {
      console.log('Required value must be greater than 0');
      return;
    }
    updateDemand(demand);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDemand((prevDemand) => ({ ...prevDemand, [name]: value }));
  };

  return (

    <Form onSubmit={handleSubmit}  id='edit-form'>
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formgridStartDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control 
         type="date"
         name="startdate"
         placeholder="Start Date"
         defaultValue={demand.startDate.split('T')[0]}
         />
      </Form.Group>
      <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>End Date</Form.Label>
      <Form.Control 
         type="date"
         name="enddate"
         placeholder="End Date"
         defaultValue={demand.endDate.split('T')[0]}
         />
      </Form.Group>
    </Row>
    <Form.Group className="mb-3" controlId="formGridAddress1">
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formgridStartDate">
        <Form.Label>Required Value</Form.Label>
        <Form.Control
         name="startdate"
         placeholder="Required Value"
         defaultValue={demand.requiredValue}
         />
      </Form.Group>
      <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>Delivered Value</Form.Label>
      <Form.Control
         name="enddate"
         placeholder="Delivered Value"
         defaultValue={demand.deliveredValue}
         />
      </Form.Group>
      <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>Maximum Value</Form.Label>
      <Form.Control 
         name="enddate"
         placeholder="Maximum Value"
         defaultValue={demand.maximumValue}
         />
      </Form.Group>
    </Row>
    </Form.Group>
    <Form.Group className="mb-3" controlId="formGridAddress2">
      <Form.Label>Description</Form.Label>
      <Form.Control 
      placeholder="Description"
      defaultValue={demand.description}/>
    </Form.Group>
    <Button variant="primary" type="submit">
              Submit
      </Button>
  </Form>



  );
};

export default EditForm;
