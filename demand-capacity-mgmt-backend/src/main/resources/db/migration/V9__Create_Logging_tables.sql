/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */

SET search_path TO public;

CREATE TABLE IF NOT EXISTS logging_history
(
    id serial primary key,
    log_id uuid,
    capacity_gp_id uuid,
    description varchar(150),
    event_type smallint,
    material_demand_id uuid,
    object_type smallint,
    time_created timestamp,
    user_account varchar(255)
);

CREATE TABLE IF NOT EXISTS archived_log
(
    id serial primary key,
    log_id uuid,
    capacity_gp_id uuid,
    description varchar(150),
    event_type smallint,
    material_demand_id uuid,
    object_type smallint,
    time_created timestamp,
    user_account varchar(255)
);