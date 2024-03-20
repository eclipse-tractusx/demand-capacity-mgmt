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

create table alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    user_id uuid,
    alert_name varchar(400),
    created varchar(400),
    description varchar(400),
    monitored_objects varchar(400),
    type varchar(400),
    threshold numeric,
    triggered_times numeric
);

create table triggered_alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    user_id uuid,
    alert_name varchar(400),
    created varchar(400),
    description varchar(400),
    monitored_objects varchar(400),
    type varchar(400),
    threshold numeric
);
create table dedicated_alerts
(
    id uuid DEFAULT uuid_generate_v4() primary key,
    object_id uuid,
    alert_name varchar(400),
    type varchar(400),
    alert_id uuid constraint alert_id references alerts(id)
);
