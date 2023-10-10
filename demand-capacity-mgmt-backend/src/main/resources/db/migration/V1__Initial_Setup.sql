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

create table demand_category
(
    id uuid DEFAULT uuid_generate_v4() primary key ,
    demand_category_code  varchar(400),
    demand_category_name varchar(400)
);

CREATE TABLE IF NOT EXISTS unit_of_measure
(
    id uuid DEFAULT uuid_generate_v4() primary key ,
    dimension varchar(15),
    un_code varchar(15),
    description varchar(50),
    description_german varchar(50),
    un_symbol varchar(15),
    c_x_symbol varchar(15)
);


create table company_base_data
(
    id  uuid constraint company_base_data_pk primary key,
    bpn varchar(400),
    company_name varchar(400),
    street varchar(400),
    number varchar(400),
    zip_code varchar(400),
    country varchar(400),
    my_company varchar(400),
    edc_url varchar(400)
);

create table material_demand
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    material_description_customer varchar(400),
    material_number_customer varchar(400),
    material_number_supplier varchar(400),
    changed_at timestamp,
    customer_id uuid constraint customer_id references company_base_data(id),
    supplier_id uuid constraint supplier_id references company_base_data(id),
    unit_of_measure_id uuid constraint unit_of_measure_id references unit_of_measure(id)
);

create table demand_series
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    material_demand_id uuid constraint material_demand_id references material_demand(id),
    customer_location_id uuid constraint customer_location_id references company_base_data(id),
    expected_supplier_location_id varchar(720),
    demand_category_code_id uuid constraint demand_category_code_id references demand_category(id)
);

create table demand_series_values
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    demand_series_id uuid constraint demand_series_id references demand_series(id),
    calendar_week timestamp not null,
    demand numeric

);