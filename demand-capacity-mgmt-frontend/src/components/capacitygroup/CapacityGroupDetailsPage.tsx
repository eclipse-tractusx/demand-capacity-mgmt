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

import { useState } from 'react';
import { Tab, Tabs} from 'react-bootstrap';


function CapacityGroupDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  

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

            TABLE
            chronogram here
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
