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

import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { logout } from "../../util/Auth";
import InfoMenu from "../menu/InfoMenu";

function TopMenuLinks() {
  const { refresh_token } = useUser();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [collapsed, setCollapsed] = useState(() => {
    // Load the state from local storage, defaulting to false if it doesn't exist
    return localStorage.getItem('navbarCollapsed') === 'true' ? true : false;
  });

  useEffect(() => {
    // Save the state to local storage whenever it changes
    localStorage.setItem('navbarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expiresIn');
      await logout(refresh_token);
      setUser(null); // Clear user data stored in context
      navigate('/login'); // Redirect the user to the login page
    } catch (error) {
      console.error('Error during logout', error);
    }
  }

  const handleNavbarClick = () => {
    setCollapsed(!collapsed);
  };

  return (

    <Navbar
      expand="lg"
      className={`navbar navbar-expand-sm bg-dark navbar-dark`}
    >
      <Container>


        <Navbar.Brand onClick={handleNavbarClick} >
          <div className="logo-container">
            <img srcSet="/media/logos/cx-short.svg" alt="Logo" width="30" height="auto" className='mx-2' />
            <h6 className={collapsed ? 'slide-out' : 'slide-in'}>
              Demand Capacity Management
            </h6>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <div className={`info-menu ${collapsed ? 'move-out' : 'move-in'}`}>
            <InfoMenu />
          </div>

        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as:  <span className='text-capitalize'>{user?.username}</span>
            <br />
            <span className='font-weight-light small-menu-text'>Role: <span className='text-capitalize'>{user?.role.toLowerCase()}</span></span>
          </Navbar.Text>
          <Nav.Link href="#settings" className="p-3 navbar-nav nav-item"><FiSettings /></Nav.Link>
          <Nav.Link onClick={handleLogout} className="p-2 navbar-nav nav-item"><FiLogOut /></Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopMenuLinks;