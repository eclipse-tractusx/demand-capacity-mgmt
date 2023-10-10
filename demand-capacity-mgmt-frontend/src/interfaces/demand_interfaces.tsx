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

import { Customer, CustomerLocation } from "./customer_interfaces";
import { ExpectedSupplierLocation, Supplier } from "./supplier_interfaces";


export interface Demand {
    id: string;
    materialDescriptionCustomer: string
    materialNumberCustomer: string
    materialNumberSupplier: string
    customerId: string
    supplierId: string
    unitMeasureId: string
    materialDemandSeries: MaterialDemandSery[]
  }
  
  export interface MaterialDemandSery {
    customerLocationId: string
    expectedSupplierLocationId: string[]
    demandCategoryId: string
    demandSeriesValues: DemandSeriesValue[]
  }
  
  export interface DemandSeriesValue {
    calendarWeek: string
    demand: number
  }

  /* Demand List */
  export interface DemandProp {
    id: string
    materialDescriptionCustomer: string
    materialNumberCustomer: string
    materialNumberSupplier: string
    customer: Customer
    supplier: Supplier
    unitMeasureId: UnitMeasureId
    changedAt: string
    demandSeries?: DemandSeries[] | undefined; 
  }
 
  export interface DemandSeries {
    customerLocation: CustomerLocation
    expectedSupplierLocation: ExpectedSupplierLocation[]
    demandCategory: DemandCategory
    demandSeriesValues: DemandSeriesValue[];
  }
    
  export interface DemandSeriesValue {
    calendarWeek: string
    demand: number
  }

  export interface DemandCategory {
    id: string
    demandCategoryCode: string
    demandCategoryName: string
  }

  export interface UnitMeasureId {
    id: string
    codeValue: string
    displayValue: string
  }

  //Demand Unlink
  export interface DemandUnlink {
    materialDemandID: string
    capacityGroupID: string
  }