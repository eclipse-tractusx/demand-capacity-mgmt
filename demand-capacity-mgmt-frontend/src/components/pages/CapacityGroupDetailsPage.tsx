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
import { useContext, useEffect, useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CapacityGroupChronogram from '../../components/capacitygroup/CapacityGroupChronogram';
import { CapacityGroupContext } from '../../contexts/CapacityGroupsContextProvider';
import DemandContextProvider from '../../contexts/DemandContextProvider';
import { EventsContext } from '../../contexts/EventsContextProvider';
import { SingleCapacityGroup } from '../../interfaces/capacitygroup_interfaces';
import { EventProp } from '../../interfaces/event_interfaces';
import CapacityGroupDemandsList from '../capacitygroup/CapacityGroupDemandsList';
import CapacityGroupSumView from '../capacitygroup/CapacityGroupSumView';
import { LoadingMessage } from '../common/LoadingMessages';
import EventsTable from '../events/EventsTable';

function CapacityGroupDetailsPage() {
  const { id } = useParams();
  const context = useContext(CapacityGroupContext);

  if (!context) {
    throw new Error('CapacityGroupDetailsPage must be used within a CapacityGroupsProvider');
  }

  const { getCapacityGroupById } = context;
  const [activeTab, setActiveTab] = useState('overview');
  const [capacityGroup, setCapacityGroup] = useState<SingleCapacityGroup | null | undefined>(null);
  const { fetchFilteredEvents } = useContext(EventsContext)!;
  const [capacityGroupEvents, setcapacityGroupEvents] = useState<EventProp[]>([]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const fetchedCapacityGroup = await getCapacityGroupById(id);
          setCapacityGroup(fetchedCapacityGroup || null);
          const filters = {
            capacity_group_id: id,
            start_time: '',
            end_time: '',
            event: '',
            material_demand_id: '',
          };
          setcapacityGroupEvents(await fetchFilteredEvents(filters));
        } catch (error) {
          console.error('Failed to fetch capacity group:', error);
        }
      })();
    }
  }, [id, getCapacityGroupById]);



  const memoizedComponent = useMemo(() => {
    if (!capacityGroup) {
      return <LoadingMessage />;
    }

    return (
      <>
        <div className="container-xl">
          <br />
          <div className="row">
            <div className="col"></div>
            <div className="col-6 border d-flex align-items-center justify-content-center" style={{ padding: '10px' }}>
              {capacityGroup?.capacityGroupId} - {capacityGroup?.capacitygroupname}
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
              <CapacityGroupSumView capacityGroup={capacityGroup} />
              <CapacityGroupChronogram capacityGroup={capacityGroup} />
            </Tab>
            <Tab eventKey="materials" title="Materials">
              <DemandContextProvider>
                <CapacityGroupDemandsList capacityGroupDemands={capacityGroup?.linkMaterialDemandIds} capacityGroupId={capacityGroup?.capacityGroupId} />
              </DemandContextProvider>
            </Tab>
            <Tab eventKey="events" title="Events">
              <EventsTable events={capacityGroupEvents} />
            </Tab>

          </Tabs>
        </div>
      </>
    );
  }, [capacityGroup, activeTab]); // Add any other dependencies if necessary

  return memoizedComponent;
}

export default CapacityGroupDetailsPage;
