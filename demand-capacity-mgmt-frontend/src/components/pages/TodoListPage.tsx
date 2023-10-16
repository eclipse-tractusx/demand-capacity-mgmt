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

import { FcTodoList } from "react-icons/fc";
import DemandList from "../common/DemandList";
import DemandsSearch from "../common/Search";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { FaMagic } from "react-icons/fa";

function TodoListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [showAddToExisting, setShowAddToExisting] = useState(false);
  const toggleWizardModal = () => {
    setShowWizard(!showWizard); // Toggle the state (true to false or false to true)
  };
  const toggleAddToExisting = () => {
    setShowAddToExisting(!showAddToExisting); // Toggle the state (true to false or false to true)
  };

  return (
    <>
      <br />
      <div className="container-xl">
        <div style={{ display: 'flex' }}>
          <FcTodoList size={35} />
          <h3 className="icon-text-padding">Todo Items</h3>
        </div>
        <div className="table">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6">
                  <DemandsSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
                <div className="col-sm-6">
                  <Button
                    className="btn btn-success float-end ms-2"
                    onClick={() => setShowAddToExisting(true)}
                  >
                    <span>Add to existing</span>
                  </Button>
                  <Button
                    className="btn btn-success float-end"
                    onClick={() => setShowWizard(true)}
                  >
                    <span><FaMagic /> Capacity Group Wizard</span>
                  </Button>
                </div>
              </div>
            </div>
            <DemandList
              searchQuery={searchQuery}
              showWizard={showWizard}
              toggleWizardModal={toggleWizardModal}
              showAddToExisting={showAddToExisting}
              toggleAddToExisting={toggleAddToExisting}
            />
          </div>
        </div>
      </div>


    </>
  );
}

export default TodoListPage;