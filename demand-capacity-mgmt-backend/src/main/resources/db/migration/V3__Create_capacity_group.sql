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
SET search_path TO public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table capacity_group
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    userID uuid,
    capacity_group_name varchar(400),
    defaultActualCapacity float,
    defaultMaximumCapacity float,
    start_date date,
    end_date date,
    customer uuid constraint capacity_group_customer_id references company_base_data(id),
    supplier uuid constraint capacity_group_supplier_id references company_base_data(id),
    link_status VARCHAR(50)
);

create table capacity_time_series
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    calendar_week varchar(255),
    actual_capacity numeric,
    maximum_capacity numeric,
    required_amount numeric,
    capacity_group_id uuid constraint capacity_group_id references capacity_group(id),
    capacity_group_entity_id uuid constraint capacity_group_entity_id references capacity_group(id),
    ruled BOOLEAN NOT NULL DEFAULT false,
    week_color VARCHAR DEFAULT 'GREY'
);

create table linked_demand_series
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    demand_category_code_id uuid constraint linked_demand_series_demand_category_code_id references demand_category(id),
    customer_id uuid constraint capacity_group_customer_id references company_base_data(id),
    material_number_customer varchar(400),
    material_number_supplier varchar(400),
    capacity_group_id uuid constraint capacity_group_id references capacity_group(id)
);

create table link_capacitygroup_demandseries
(
    id uuid primary key,
    demand_category_code_id uuid,
    customer_id uuid,
    material_number_customer varchar(400),
    material_number_supplier varchar(400),
    capacity_group_id uuid,
    material_demand_id uuid
);
