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

export interface ConfiguredAlertProps {
    id: string;
    alertName: string
    threshold: string
    monitoredObjects: string
    type: string
    created: string
    dedicatedAlerts: DedicatedAlert[]
    triggerTimes: string
    triggerTimesInThreeMonths: string
}

export interface DedicatedAlert {
    type: string;
    objectId: string
}

export interface TriggeredAlertProps {
    id: string;
    alertName: string
    threshold: string
    monitoredObjects: string
    created: string
    description: string
    type: string
    dedicatedAlerts: string[]
}