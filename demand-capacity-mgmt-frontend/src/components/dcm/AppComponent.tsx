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
import {Route, Routes} from "react-router-dom";
import TopMenu from "../common/TopMenu";
import {InfoMenuProvider} from '../../contexts/InfoMenuContextProvider';
import Home from "../pages/CapacityGroupPage";
import CapacityGroupDetailsPage from "../pages/CapacityGroupDetailsPage";
import AuthenticatedRoute from "../../util/AuthenticatedRoute";
import AuthenticationComponent from "../auth/AuthenticationComponent";
import { UserProvider } from '../../contexts/UserContext';
import EventsPage from "../pages/EventsPage";


const AppComponent: React.FC = () => {
    return (
        <UserProvider>
            <div>
                <Routes>
                    <Route path="/" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <Home />
                        </AuthenticatedRoute>
                    } />

                    <Route path="/details" element={
                        <AuthenticatedRoute>
                            <CapacityGroupDetailsPage />
                        </AuthenticatedRoute>
                    } />
                    <Route path="/events" element={
                        <AuthenticatedRoute>
                            <EventsPage />
                        </AuthenticatedRoute>
                    } />

                    <Route path="/login" element={<AuthenticationComponent />} />
                </Routes>
            </div>
        </UserProvider>
    );
}

export default AppComponent;