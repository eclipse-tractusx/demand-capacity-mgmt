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
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FiSave } from 'react-icons/fi';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';
import { DemandContext } from '../../contexts/DemandContextProvider';
import UnitsofMeasureContextContextProvider from '../../contexts/UnitsOfMeasureContextProvider';
import { Demand, DemandProp, DemandSeries, DemandSeriesValue } from '../../interfaces/demand_interfaces';
import CompanyOptions from '../common/CompanyOptions';
import { LoadingGatheringDataMessage } from '../common/LoadingMessages';
import UnitsOfMeasureOptions from '../common/UnitsofMeasureOptions';

function convertToDemand(demandProp: DemandProp): Demand {
  const {
    id,
    materialDescriptionCustomer,
    materialNumberCustomer,
    materialNumberSupplier,
    customer,
    supplier,
    unitMeasureId,
    demandSeries,
  } = demandProp;

  const materialDemandSeries = demandSeries!.map((series: DemandSeries) => ({
    customerLocationId: customer.id,
    expectedSupplierLocationId: [supplier.id],
    demandCategoryId: series.demandCategory.id,
    demandSeriesValues: series.demandSeriesValues.map((value: DemandSeriesValue) => ({
      calendarWeek: value.calendarWeek.split('T')[0],
      demand: value.demand,
    })),
  }));

  const convertedDemand: Demand = {
    id,
    materialDescriptionCustomer,
    materialNumberCustomer,
    materialNumberSupplier,
    customerId: customer.id,
    supplierId: supplier.id,
    unitMeasureId: unitMeasureId.id,
    materialDemandSeries,
  };

  return convertedDemand;
}




interface EditFormProps {
  theDemand: DemandProp;
  onCloseModal: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ theDemand, onCloseModal }) => {
  const { updateDemand, getDemandbyId } = useContext(DemandContext)!;
  const [demand, setDemand] = useState<DemandProp | undefined>(undefined);

  useEffect(() => {
    const fetchDemand = async () => {
      try {
        const fetchedDemand = await getDemandbyId(theDemand.id);
        setDemand(fetchedDemand);
      } catch (error) {
        console.error('Error fetching demand:', error);
      }
    };

    fetchDemand();
  }, [theDemand, getDemandbyId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (demand) {
      const convertedDemand = convertToDemand(demand);
      try {
        await updateDemand(convertedDemand);
        onCloseModal();
      } catch (error) {
        console.error('Error updating demand:', error);
      }
    }
  };

  const handleFieldChange = (fieldName: string, newValue: any) => {
    setDemand((prevDemand) =>
      prevDemand
        ? {
          ...prevDemand,
          [fieldName]:
            fieldName === 'demandSeries'
              ? newValue.map((series: DemandSeries) => ({
                ...series,
                demandSeriesValues: series.demandSeriesValues.map((value: DemandSeriesValue) => ({
                  ...value,
                  calendarWeek: value.calendarWeek.split('T')[0], // Extract date portion from datetime string
                })),
              }))
              : fieldName === 'startDate' || fieldName === 'endDate'
                ? newValue.split('T')[0] // Extract date portion from datetime string
                : newValue,
        }
        : undefined
    );
  };

  const handleUnitMeasureChange = (value: string) => {
    // Call handleFieldChange with the appropriate parameters
    handleFieldChange('unitMeasureId', { id: value });
  };

  const handleSupplierChange = (value: string) => {
    // Call handleFieldChange with the appropriate parameters
    handleFieldChange('supplier', { id: value });
  };

  if (!demand) {
    return (
      <LoadingGatheringDataMessage />
    );
  }

  return (

    <Form onSubmit={handleSubmit}>
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
          <UnitsofMeasureContextContextProvider>
            <UnitsOfMeasureOptions selectedUnitMeasureId={demand.unitMeasureId.id} onChange={handleUnitMeasureChange} />
          </UnitsofMeasureContextContextProvider>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3 form-group required">
        <Form.Label className="control-label required-field-label">Supplier</Form.Label>
        <CompanyContextProvider>
          <CompanyOptions selectedCompanyName={demand.supplier.id} onChange={handleSupplierChange} />
        </CompanyContextProvider>
      </Form.Group>

      <Form.Group className="mb-3 form-group required">
        <Form.Label className="control-label required-field-label">Material Number Customer</Form.Label>
        <Form.Control
          type="text"
          placeholder="Material Number"
          id="materialNumberCustomer"
          name="materialNumberCustomer"
          defaultValue={demand.materialNumberCustomer}
          onChange={(e) =>
            setDemand((prevDemand) =>
              prevDemand
                ? {
                  ...prevDemand,
                  materialNumberCustomer: e.target.value,
                }
                : undefined
            )
          }
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
          onChange={(e) =>
            setDemand((prevDemand) =>
              prevDemand
                ? {
                  ...prevDemand,
                  materialNumberSupplier: e.target.value,
                }
                : undefined
            )
          }
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
          onChange={(e) =>
            setDemand((prevDemand) =>
              prevDemand
                ? {
                  ...prevDemand,
                  materialDescriptionCustomer: e.target.value,
                }
                : undefined
            )
          }
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FiSave size={23} /> Save Changes
        </div>
      </Button>
    </Form>



  );
};

export default EditForm;
