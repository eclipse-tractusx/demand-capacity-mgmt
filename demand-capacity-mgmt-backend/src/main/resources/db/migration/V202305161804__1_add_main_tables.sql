/*
 * *******************************************************************************
 *   Copyright (c) 2023 BMW AG
 *   Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *   See the NOTICE file(s) distributed with this work for additional
 *   information regarding copyright ownership.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Apache License, Version 2.0 which is available at
 *   https://www.apache.org/licenses/LICENSE-2.0.
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *   License for the specific language governing permissions and limitations
 *   under the License.
 *
 *   SPDX-License-Identifier: Apache-2.0
 *   ********************************************************************************
 *
 */

create table project
(
    id  float constraint id_pk primary key,
    name         varchar(400),
    initial_date timestamp not null,
    final_date   timestamp,
    type         varchar(30)
);

create table company
(
    id   float constraint company_pk primary key,
    type varchar(10),
    name varchar(400)
);

create table unit_measure
(
    id   float constraint unit_measure_id primary key,
    un varchar(3),
    name varchar(40)
);

create table demand
(
    id float not null constraint demand_pk primary key,
    project_id  float constraint project_id references project(id),
    company_id  float constraint company_id references company(id),
    required_value numeric,
    delivered_value     numeric,
    maximum_value     numeric,
    demand_category varchar(50),
    unit_measure_id integer constraint unit_measure_id references unit_measure(id),
    description varchar(400),
    start_date timestamp not null,
    end_date   timestamp,
    updated_date timestamp
);


CREATE SEQUENCE hibernate_sequence START 1;








