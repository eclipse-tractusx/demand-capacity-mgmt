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
import './custom-bootstrap.scss';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route,Routes } from "react-router-dom";
import { isAuthenticated } from './util/Auth';
import AppComponent from './components/dcm/AppComponent';

//Import Default always visible components.
import TopMenu from "./components/common/TopMenu";
import { InfoMenuProvider } from './contexts/InfoMenuContextProvider';
import QuickAcessItems from "./components/common/QuickAcessItems";
//Import Context Providers
import DemandContextProvider from "../src/contexts/DemandContextProvider";
import CapacityGroupsProvider from './contexts/CapacityGroupsContextProvider';
//Pages
import Home from "./components/pages/CapacityGroupPage";
import CapacityGroupDetailsPage from "./components/pages/CapacityGroupDetailsPage";

import TodoListPage from "./components/pages/TodoListPage";
import DownStatusPage from "./components/pages/DownStatusPage";
import UpStatusPage from "./components/pages/UpStatusPage";

import './custom-bootstrap.scss';
import'./index.css';
import {UserProvider} from "./contexts/UserContext";
import AuthenticationComponent from "./components/pages/AuthenticationPage";


const root = ReactDOM.createRoot(document.getElementById('root'));
function App() {
    const authenticated = isAuthenticated();
    return (
        <UserProvider>
            <Router>
                {authenticated ? <AppComponent /> : <AuthenticationComponent />}
            </Router>
        </UserProvider>
    );
}

root.render(
    <App>
        <InfoMenuProvider>
            <TopMenu></TopMenu>
        </InfoMenuProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/details/:id" element={<CapacityGroupsProvider><CapacityGroupDetailsPage/></CapacityGroupsProvider>} />
                <Route path="/up" element={<DemandContextProvider><UpStatusPage/></DemandContextProvider>} />
                <Route path="/down" element={<DemandContextProvider><DownStatusPage/></DemandContextProvider>} />
                <Route path="/todo" element={<DemandContextProvider><TodoListPage/></DemandContextProvider>} /> 
            </Routes>
        </Router>
        <DemandContextProvider>
            <QuickAcessItems></QuickAcessItems>
        </DemandContextProvider>
    </App>
);
