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

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO unit_of_measure
(id,dimension,un_code, description, description_german, un_symbol, c_x_symbol)
VALUES
    (uuid_generate_v4(),'Mass','GRM','Gram','Gramm','g','g'),
    (uuid_generate_v4(),'Mass','KGM','Kilogram','Kilogramm','kg','kg'),
    (uuid_generate_v4(),'Mass','TNE','Metric ton','Metrische Tonne','t','t'),
    (uuid_generate_v4(),'Mass','STN','ton (US) - short ton (UK/US)','US Tonne','ton (US)','ton'),
    (uuid_generate_v4(),'Mass','ONZ','Ounce','Unze','oz','oz'),
    (uuid_generate_v4(),'Mass','LBR','Pound','Pfund','lb','lb'),
    (uuid_generate_v4(),'Length','CMT','Centimetre','Zentimeter','cm','cm'),
    (uuid_generate_v4(),'Length','MTR','Metre','Meter','m','m'),
    (uuid_generate_v4(),'Length','KTM','Kilometre','Kiometer','km','km'),
    (uuid_generate_v4(),'Length','INH','Inch','Zoll','in','in'),
    (uuid_generate_v4(),'Length','FOT','Foot','Fuß','ft','ft'),
    (uuid_generate_v4(),'Length','YRD','Yard','yard','yd','yd'),
    (uuid_generate_v4(),'Area','CMK','Square centimetre','Quadrat-zentimeter','cm2','cm2'),
    (uuid_generate_v4(),'Area','MTK','Square metre','Quadratmeter','m2','m2'),
    (uuid_generate_v4(),'Area','INK','Square inch','Quadratzoll','in2','in2'),
    (uuid_generate_v4(),'Area','FTK','Square foot','Quadratfuß','ft2','ft2'),
    (uuid_generate_v4(),'Area','YDK','Square yard','Quadratyard','yd2','yd2'),
    (uuid_generate_v4(),'Volume','CMQ','Cubic centimetre','Kubikzentimeter','cm3','cm3'),
    (uuid_generate_v4(),'Volume','MTQ','Cubic metre','Kubikmeter','m3','m3'),
    (uuid_generate_v4(),'Volume','INQ','Cubic inch','Kubikzoll','in3','in3'),
    (uuid_generate_v4(),'Volume','FTQ','Cubic foot','Kubikfuß','ft3','ft3'),
    (uuid_generate_v4(),'Volume','YDQ','Cubic yard','Kubikyard','yd3','yd3'),
    (uuid_generate_v4(),'Volume','MLT','Millilitre','Milliliter','ml','ml'),
    (uuid_generate_v4(),'Volume','LTR','Litre','Liter','l','l'),
    (uuid_generate_v4(),'Volume','HLT','Hectolitre','Hektoliter','hl','hl'),
    (uuid_generate_v4(),'Quantity','H87','Piece','Stück','','pc'),
    (uuid_generate_v4(),'Quantity','SET','Set','Satz','','set'),
    (uuid_generate_v4(),'Quantity','PR','Pair','Paar','','pr'),
    (uuid_generate_v4(),'Quantity','ZP','Page','Blatt','','pg'),
    (uuid_generate_v4(),'Mechanic','KWH','Kilowatt hour','Kilowattstunde','kW-h','kwh'),
    (uuid_generate_v4(),'(blank)','','','','','xxx');


ALTER TABLE IF EXISTS demand_category ADD COLUMN description varchar(200);

INSERT INTO demand_category
(id,demand_category_code, demand_category_name, description)
VALUES
    (uuid_generate_v4(),'0001','Default','No Assignement'),
    (uuid_generate_v4(),'A1S1','After-Sales','After sales demand of spare parts'),
    (uuid_generate_v4(),'SR99','Series','Dependent demand, production, assembly, raw material'),
    (uuid_generate_v4(),'PI01','Phase-In-period','Ramp up of a new product or new material introduction'),
    (uuid_generate_v4(),'OS01','Single-Order','Demand outside the normal spectrum of supply'),
    (uuid_generate_v4(),'OI01','Small series','Short time frame for demand and pose to higher volatility'),
    (uuid_generate_v4(),'ED01','Extraordinary demand','Temporary demand on top of standard demand'),
    (uuid_generate_v4(),'PO01','Phase-Out-period','Ramp down. Product or material retires from the market')