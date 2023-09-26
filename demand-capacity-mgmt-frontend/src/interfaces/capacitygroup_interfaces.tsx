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

import { DemandProp } from "./demand_interfaces"

export interface CapacityGroup {
  internalId: string
  catXUuid: string
  name: string
  customerBPNL: string
  customerName: string
  supplierBNPL: string
  numberOfMaterials: number
  favoritedBy: string
  status: string
  [key: string]: string | number;
  }

interface Address {
  id: string;
  bpn: string;
  companyName: string;
  street: string;
  number: string;
  zipCode: string;
  country: string;
  myCompany: string;
}

interface UnitOfMeasure {
  id: string;
  codeValue: string;
  displayValue: string;
}

interface Capacities{
  actualCapacity: bigint,
  maximumCapacity: bigint;
  calendarWeek: string
}

interface DemandCategory {
  id: string;
  demandCategoryCode: string;
  demandCategoryName: string;
}

interface LinkedDemand {
  demandCategory: DemandCategory;
  customerLocation: Address;
  materialNumberSupplier: string;
  materialNumberCustomer: string;
}

export interface SingleCapacityGroup {
  capacities: Capacities[];
  supplierLocations: Address[];
  customer: Address;
  supplier: Address;
  capacityGroupId: string;
  linkedDemandSeries: DemandProp[];
  unitOfMeasure: UnitOfMeasure;
  changeAt: string;
  name: string;
}
