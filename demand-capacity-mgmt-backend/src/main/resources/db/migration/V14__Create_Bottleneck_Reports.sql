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

-- Filename: V1__Create_year_reports_schema.sql
SET SEARCH_PATH TO public;

CREATE TABLE year_reports (
                              id SERIAL PRIMARY KEY,
                              year INT NOT NULL,
                              total_weeks_current_year INT NOT NULL
);

CREATE TABLE month_reports (
                               id SERIAL PRIMARY KEY,
                               year_report_id INT REFERENCES year_reports(id),
                               month VARCHAR(255) NOT NULL
);

CREATE TABLE week_reports (
                              id SERIAL PRIMARY KEY,
                              month_report_id INT REFERENCES month_reports(id),
                              week INT NOT NULL,
                              delta DOUBLE PRECISION NOT NULL,
                              max_capacity DOUBLE PRECISION NOT NULL,
                              act_capacity DOUBLE PRECISION NOT NULL
);

-- Assuming the demand_series table already exists and DemandSeries entity is already defined elsewhere,
-- we just add a foreign key constraint to it.

ALTER TABLE week_reports ADD COLUMN demand_series_id UUID;
ALTER TABLE week_reports
    ADD CONSTRAINT fk_demand_series
        FOREIGN KEY (demand_series_id)
            REFERENCES demand_series(id);


ALTER TABLE year_reports ADD COLUMN capacity_group_id UUID;
ALTER TABLE year_reports ADD COLUMN ruled BOOLEAN DEFAULT false;
ALTER TABLE year_reports ADD COLUMN percentage INT;
ALTER TABLE year_reports ADD COLUMN user_id UUID;
