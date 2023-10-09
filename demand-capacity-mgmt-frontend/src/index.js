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
import { BrowserRouter as Router } from "react-router-dom";
import { isAuthenticated } from './util/Auth';
import AuthenticationComponent from './components/auth/AuthenticationComponent';
import AppComponent from './components/dcm/AppComponent';

function App() {
    const authenticated = isAuthenticated();
    return (
        <Router>
            {authenticated ? <AppComponent /> : <AuthenticationComponent />}
        </Router>
    );
}


//Import Default always visible components.
import TopMenu from "./components/common/TopMenu";
import { InfoMenuProvider } from './contexts/InfoMenuContextProvider';
import QuickAcessItems from "./components/common/QuickAcessItems";
//Import Context Providers
import DemandContextProvider from "../src/contexts/DemandContextProvider";
// Import your components for different routes
import Home from "./components/pages/CapacityGroupPage";
import CapacityGroupDetailsPage from "./components/pages/CapacityGroupDetailsPage";
import CapacityGroupsProvider from './contexts/CapacityGroupsContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<>
    <InfoMenuProvider>
    <TopMenu></TopMenu>
    </InfoMenuProvider>

    <Router>
    <Routes>
        <Route  path="/" element={<Home/>} />
        <Route path="/details/:id" element={<CapacityGroupsProvider><CapacityGroupDetailsPage/></CapacityGroupsProvider>} />
        <Route path="/contact" />
    </Routes>
</Router>
<DemandContextProvider>
            <QuickAcessItems></QuickAcessItems>
</DemandContextProvider>
</>

);
