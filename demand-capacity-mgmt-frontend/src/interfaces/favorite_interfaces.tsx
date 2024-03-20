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
export interface CompanyDtoFavoriteResponse {
    id: string;
    bpn: string;
    companyName: string;
    zipCode: string;
    country: string;
    myCompany: string;
}

export interface EventFavoriteResponse {
    id: number;
    logID: string;
    eventType: string;
    timeCreated: string;
    userAccount: string;
    description: string;
}

export interface MaterialDemandFavoriteResponse {
    id: string;
    materialDescriptionCustomer: string;
    materialNumberCustomer: string;
    materialNumberSupplier: string;
    customer: string;
    supplier: string;
    unitOfMeasure: string;
    changedAt: string;
}

export interface SingleCapacityGroupFavoriteResponse {
    id: string;
    customer: string;
    supplier: string;
    capacityGroupId: string;
    capacityGroupName: string;
}

export interface AddressBookFavoriteResponse {
    id: string
    companyId: string
    name: string
    contact: string
    email: string
    function: string
}

export interface FavoriteResponse {
    capacityGroups: SingleCapacityGroupFavoriteResponse[];
    materialDemands: MaterialDemandFavoriteResponse[];
    companies: CompanyDtoFavoriteResponse[];
    events: EventFavoriteResponse[];
    addressBooks: AddressBookFavoriteResponse[];
}

export enum FavoriteType {
    CAPACITY_GROUP = 'CAPACITY_GROUP',
    COMPANY_BASE_DATA = 'COMPANY_BASE_DATA',
    MATERIAL_DEMAND = 'MATERIAL_DEMAND',
    EVENT = 'EVENT',
    ADDRESS_BOOK = 'ADDRESS_BOOK'
}

export interface FavoritePayload {
    favoriteId: string;
    fType: string;
}