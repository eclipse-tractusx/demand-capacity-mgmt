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

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { logout } from "../../util/Auth";
import InfoMenu from "../menu/InfoMenu";

function TopMenuLinks() {
  const { refreshToken } = useUser();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expiresIn');
      await logout(refreshToken);
      setUser(null); // Clear user data stored in context
      navigate('/login'); // Redirect the user to the login page
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  return (
    <Navbar expand="lg" className="navbar navbar-expand-sm bg-dark navbar-dark">
      <Container>
        <Navbar.Brand  ><img srcSet='/media/logos/cx-short.svg' alt="Logo" width="30" height="auto" className='d-inline-block align-text-top' /> Demand Capacity Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <InfoMenu />
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a> {user?.username}</a>
          </Navbar.Text>
          <Nav.Link href="#settings" className="p-3 navbar-nav nav-item"><FiSettings /></Nav.Link>
          <Nav.Link onClick={handleLogout} className="p-2 navbar-nav nav-item"><FiLogOut /></Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopMenuLinks;