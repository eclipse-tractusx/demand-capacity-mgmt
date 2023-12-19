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
import AlertsContextProvider from "../../contexts/AlertsContextProvider";
import CapacityGroupsProvider from '../../contexts/CapacityGroupsContextProvider';
import CompanyContextProvider from '../../contexts/CompanyContextProvider';
import DemandContextProvider from '../../contexts/DemandContextProvider';
import EventsContextProvider from '../../contexts/EventsContextProvider';
import FavoritesContextProvider from "../../contexts/FavoritesContextProvider";
import AuthenticatedRoute from "../../util/AuthenticatedRoute";
import QuickAcessItems from '../common/QuickAcessItems';
import AdminPage from '../pages/AdminPage';
import AlertsPage from '../pages/AlertsPage';
import AuthenticationComponent from '../pages/AuthenticationPage';
import CapacityGroupDetailsPage from "../pages/CapacityGroupDetailsPage";
import Home from "../pages/CapacityGroupPage";
import DownStatusPage from '../pages/DownStatusPage';
import ErrorPage from '../pages/ErrorPage';
import EventsPage from "../pages/EventsPage";
import FavoritesPage from "../pages/FavoritesPage";
import TodoListPage from '../pages/TodoListPage';
import UpStatusPage from '../pages/UpStatusPage';
import Layout from './Layout';


const AppComponent: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthenticationComponent />} />
            <Route path="*" element={<ErrorPage />} />

            <Route path="/" element={

                <AuthenticatedRoute>
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <CompanyContextProvider>
                                <Layout>
                                    <Home />
                                    <QuickAcessItems />
                                </Layout>
                            </CompanyContextProvider>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute>

            } />

            <Route path="/details/:id" element={
                <AuthenticatedRoute>
                    <FavoritesContextProvider>
                        <CapacityGroupsProvider>
                            <DemandContextProvider>
                                <Layout>
                                    <EventsContextProvider>
                                        <CapacityGroupDetailsPage />
                                    </EventsContextProvider>
                                </Layout>
                            </DemandContextProvider>
                        </CapacityGroupsProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute>
            } />
            <Route path="/alerts" element={
                <AuthenticatedRoute>
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <CapacityGroupsProvider>
                                <Layout>
                                    <AlertsContextProvider>
                                        <AlertsPage />
                                    </AlertsContextProvider>
                                </Layout>
                            </CapacityGroupsProvider>
                        </DemandContextProvider >
                    </FavoritesContextProvider >
                </AuthenticatedRoute >
            } />
            < Route path="/up" element={
                < AuthenticatedRoute >
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <Layout>
                                <EventsContextProvider>
                                    <UpStatusPage />
                                </EventsContextProvider>
                            </Layout>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute >
            } />
            < Route path="/down" element={
                < AuthenticatedRoute >
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <Layout>
                                <EventsContextProvider>
                                    <DownStatusPage />
                                </EventsContextProvider>
                            </Layout>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute >
            } />
            < Route path="/todo" element={
                < AuthenticatedRoute >
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <Layout>
                                <EventsContextProvider>
                                    <TodoListPage />
                                </EventsContextProvider>
                            </Layout>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute >
            } />

            < Route path="/events" element={
                < AuthenticatedRoute >
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <Layout>
                                <EventsContextProvider>
                                    <EventsPage />
                                </EventsContextProvider>
                            </Layout>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute >
            } />

            < Route path="/favorites" element={
                < AuthenticatedRoute >
                    <DemandContextProvider>
                        <FavoritesContextProvider>
                            <Layout>

                                <FavoritesPage />

                            </Layout>
                        </FavoritesContextProvider>
                    </DemandContextProvider>
                </AuthenticatedRoute >
            } />

            < Route path="/admin" element={
                < AuthenticatedRoute >
                    <FavoritesContextProvider>
                        <DemandContextProvider>
                            <Layout>
                                <AdminPage />
                            </Layout>
                        </DemandContextProvider>
                    </FavoritesContextProvider>
                </AuthenticatedRoute >
            } />
        </Routes >
    );
}

export default AppComponent;