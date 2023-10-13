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

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { isAuthenticated } from './Auth';

interface AuthenticatedRouteProps {
    children: React.ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
    const { refresh_token } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthentication = async () => {
            if (refresh_token) {
                const authenticated = await isAuthenticated(refresh_token);
                setIsAuthed(authenticated);
            } else {
                setIsAuthed(false);
            }
        };

        checkAuthentication();
    }, [refresh_token]);

    useEffect(() => {
        if (isAuthed === false) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [isAuthed, navigate, location]);

    if (isAuthed === null) return null;  // Still determining authentication status

    return <>{children}</>;
};

export default AuthenticatedRoute;
