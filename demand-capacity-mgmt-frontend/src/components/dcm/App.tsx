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
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthorizationCodeCallback } from "react-oauth2-auth-code-flow";

// All your imports...
//import LoginComponent from './components/LoginComponent';
//import AppComponent from './components/App';

function App() {
    const { authenticated } = useOAuth2();

    return (
        <Router>
            {authenticated ? <AppComponent /> : <LoginComponent />}
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <OAuth2Provider
        clientId={YOUR_CLIENT_ID}
        redirectUri={YOUR_REDIRECT_URI}
        authorizeUrl={YOUR_AUTHORIZATION_URL}
        tokenUrl={YOUR_TOKEN_URL}
    >
        <App />
    </OAuth2Provider>
);

reportWebVitals();
