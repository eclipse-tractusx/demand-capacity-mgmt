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

import React, { useState } from 'react';
import { Tab, Tabs, ButtonGroup, Button, ToggleButton } from 'react-bootstrap';
import CapacityGroupChronogram from "./CapacityGroupChronogram";

function CapacityGroupDetailsPage() {
  const [editMode, setEditMode] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    // Perform save operation here
    setEditMode(false);
    setSavedChanges(true);
    console.log(savedChanges);// todo clean
  };

  const handleRevert = () => {
    // Revert changes here
    setEditMode(false);
    setSavedChanges(false);
  };
  

  return (
    <>
      <div className="container-xl">
        <br />
        <div className="row">
          <div className="col"></div>
          <div className="col-6 border d-flex align-items-center justify-content-center">
            UUID - CapacityGroupName
          </div>
            <div className="col d-flex justify-content-end">
              <br />
              {activeTab === 'overview' && (
              <ButtonGroup className="mb-2 align-middle">
                <ToggleButton
                  id="toggle-edit"
                  type="checkbox"
                  variant="secondary"
                  name="edit"
                  value="0"
                  checked={editMode}
                  onChange={() => setEditMode(!editMode)}
                >
                  Edit
                </ToggleButton>
                <Button variant="secondary" name="save" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="secondary" name="revert" onClick={handleRevert}>
                  Revert Changes
                </Button>
              </ButtonGroup>
                        )}
            </div>  
        </div>
        <Tabs
          defaultActiveKey="overview"
          id="uncontrolled-tab-example"
          className="mb-3"
          activeKey={activeTab}
          onSelect={(tabKey) => {
            if (typeof tabKey === 'string') {
              setActiveTab(tabKey);
            }
          }}
        >
          <Tab eventKey="overview" title="Overview">
            <CapacityGroupChronogram />
          </Tab>
          <Tab eventKey="materials" title="Materials">
            Materials Table here
          </Tab>
          <Tab eventKey="events" title="Events">
            Pre filtered event list here
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default CapacityGroupDetailsPage;



const renderMonthTick = (tickProps: any) => {
  const { x, y, payload } = tickProps;
  const { value } = payload;
  const date = new Date(value);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const month = date.getMonth();


  // For beginning and end of the month
  if (date.getDate() === 1 || new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === date.getDate()) {
    const pathX = Math.floor(x) + 0.5;
    return (
        <g>
          <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />
          <text x={x} y={y - 40} textAnchor="middle">{monthNames[month]}</text>
        </g>
    );
  }

  return <g />; // Return empty SVG group element instead of null
};
