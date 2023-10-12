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
import { Route, Routes } from "react-router-dom";
import CapacityGroupsProvider from '../../contexts/CapacityGroupsContextProvider';
import DemandContextProvider from '../../contexts/DemandContextProvider';
import EventsContextProvider from '../../contexts/EventsContextProvider';
import { InfoMenuProvider } from '../../contexts/InfoMenuContextProvider';
import AuthenticatedRoute from "../../util/AuthenticatedRoute";
import QuickAcessItems from '../common/QuickAcessItems';
import TopMenu from "../common/TopMenu";
import AuthenticationComponent from "../pages/AuthenticationPage";
import CapacityGroupDetailsPage from "../pages/CapacityGroupDetailsPage";
import Home from "../pages/CapacityGroupPage";
import DownStatusPage from '../pages/DownStatusPage';
import ErrorPage from '../pages/ErrorPage';
import EventsPage from "../pages/EventsPage";
import TodoListPage from '../pages/TodoListPage';
import UpStatusPage from '../pages/UpStatusPage';


const AppComponent: React.FC = () => {
    return (
            <div>
                <Routes>
                    <Route path="/" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <Home />
                            <DemandContextProvider><QuickAcessItems /></DemandContextProvider>
                        </AuthenticatedRoute>
                    } />

                    <Route path="/details/:id" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <CapacityGroupsProvider><CapacityGroupDetailsPage /></CapacityGroupsProvider>
                            <QuickAcessItems />
                        </AuthenticatedRoute>
                    } />
                    <Route path="/up" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <DemandContextProvider>  <UpStatusPage />
                                <QuickAcessItems /></DemandContextProvider>
                        </AuthenticatedRoute>
                    } />
                    <Route path="/down" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <DemandContextProvider><DownStatusPage />
                                <QuickAcessItems /></DemandContextProvider>
                        </AuthenticatedRoute>
                    } />
                    <Route path="/todo" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <DemandContextProvider><TodoListPage />
                                <QuickAcessItems /></DemandContextProvider>
                        </AuthenticatedRoute>
                    } />

                    <Route path="/events" element={
                        <AuthenticatedRoute>
                            <InfoMenuProvider>
                                <TopMenu />
                            </InfoMenuProvider>
                            <EventsContextProvider><EventsPage /></EventsContextProvider>

                            <DemandContextProvider><QuickAcessItems /></DemandContextProvider>
                        </AuthenticatedRoute>
                    } />

                    <Route path="/login" element={<AuthenticationComponent />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </div>
    );
}

export default AppComponent;