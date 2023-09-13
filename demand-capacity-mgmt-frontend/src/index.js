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

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route,Routes } from "react-router-dom";



//Import Default always visible components.
import TopMenu from "./components/TopMenu";
import { InfoMenuProvider } from './contexts/InfoMenuContextProvider';
import QuickAcessItems from "./components/QuickAcessItems";
//Import Context Providers
import DemandContextProvider from "../src/contexts/DemandContextProvider";
// Import your components for different routes
import Home from "./components/capacitygroup/CapacityGroupPage";
import CapacityGroupDetailsPage from "./components/capacitygroup/CapacityGroupDetailsPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<>
    <InfoMenuProvider>
    <TopMenu></TopMenu>
    </InfoMenuProvider>

    <Router>
    <Routes>
        <Route  path="/" element={<Home/>} />
        <Route path="/details" element={<CapacityGroupDetailsPage/>} />
        <Route path="/contact" />
    </Routes>
</Router>
<DemandContextProvider>
            <QuickAcessItems></QuickAcessItems>
</DemandContextProvider>
</>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
