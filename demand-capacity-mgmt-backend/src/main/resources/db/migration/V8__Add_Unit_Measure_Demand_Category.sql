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
INSERT INTO unit_of_measure
(dimension,un_code, description, description_german, un_symbol, c_x_symbol)
VALUES
    ('Mass','GRM','Gram','Gramm','g','g'),
    ('Mass','KGM','Kilogram','Kilogramm','kg','kg'),
    ('Mass','TNE','Metric ton','Metrische Tonne','t','t'),
    ('Mass','STN','ton (US) - short ton (UK/US)','US Tonne','ton (US)','ton'),
    ('Mass','ONZ','Ounce','Unze','oz','oz'),
    ('Mass','LBR','Pound','Pfund','lb','lb'),
    ('Length','CMT','Centimetre','Zentimeter','cm','cm'),
    ('Length','MTR','Metre','Meter','m','m'),
    ('Length','KTM','Kilometre','Kiometer','km','km'),
    ('Length','INH','Inch','Zoll','in','in'),
    ('Length','FOT','Foot','Fuß','ft','ft'),
    ('Length','YRD','Yard','yard','yd','yd'),
    ('Area','CMK','Square centimetre','Quadrat-zentimeter','cm2','cm2'),
    ('Area','MTK','Square metre','Quadratmeter','m2','m2'),
    ('Area','INK','Square inch','Quadratzoll','in2','in2'),
    ('Area','FTK','Square foot','Quadratfuß','ft2','ft2'),
    ('Area','YDK','Square yard','Quadratyard','yd2','yd2'),
    ('Volume','CMQ','Cubic centimetre','Kubikzentimeter','cm3','cm3'),
    ('Volume','MTQ','Cubic metre','Kubikmeter','m3','m3'),
    ('Volume','INQ','Cubic inch','Kubikzoll','in3','in3'),
    ('Volume','FTQ','Cubic foot','Kubikfuß','ft3','ft3'),
    ('Volume','YDQ','Cubic yard','Kubikyard','yd3','yd3'),
    ('Volume','MLT','Millilitre','Milliliter','ml','ml'),
    ('Volume','LTR','Litre','Liter','l','l'),
    ('Volume','HLT','Hectolitre','Hektoliter','hl','hl'),
    ('Quantity','H87','Piece','Stück','','pc'),
    ('Quantity','SET','Set','Satz','','set'),
    ('Quantity','PR','Pair','Paar','','pr'),
    ('Quantity','ZP','Page','Blatt','','pg'),
    ('Mechanic','KWH','Kilowatt hour','Kilowattstunde','kW-h','kwh'),
    ('(blank)','','','','','xxx');


ALTER TABLE IF EXISTS demand_category ADD COLUMN description varchar(200);

INSERT INTO demand_category
(demand_category_code, demand_category_name, description)
VALUES
    ('0001','Default','No Assignement'),
    ('A1S1','After-Sales','After sales demand of spare parts'),
    ('SR99','Series','Dependent demand, production, assembly, raw material'),
    ('PI01','Phase-In-period','Ramp up of a new product or new material introduction'),
    ('OS01','Single-Order','Demand outside the normal spectrum of supply'),
    ('OI01','Small series','Short time frame for demand and pose to higher volatility'),
    ('ED01','Extraordinary demand','Temporary demand on top of standard demand'),
    ('PO01','Phase-Out-period','Ramp down. Product or material retires from the market')