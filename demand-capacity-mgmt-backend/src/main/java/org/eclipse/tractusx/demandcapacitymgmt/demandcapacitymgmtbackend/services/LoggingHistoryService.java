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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.sql.Timestamp;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;

public interface LoggingHistoryService {
    List<LoggingHistoryResponse> getAllLoggingHistory();
    LoggingHistoryResponse createLog(LoggingHistoryRequest logEntity);
    void deleteLogById(String logId);
    void deleteAllLogs();
    void archiveLog(LoggingHistoryRequest loggingHistoryRequest);
    List<ArchivedLoggingHistoryResponse> getAllArchivedLogs();
    void deleteAllArchivedLogs();
    void deleteArchivedLogById(String logId);
    List<LoggingHistoryResponse> getLoggingHistoryByCapacityId(String capacityGroupId);
    List<LoggingHistoryResponse> getLoggingHistoryByMaterialDemandId(String materialDemandId);
    List<LoggingHistoryResponse> filterByFavoriteMaterialDemand();
    List<LoggingHistoryResponse> filterByFavoriteCapacityGroup();
    List<LoggingHistoryResponse> filterByTime(Timestamp startTime, Timestamp endTime);
    List<LoggingHistoryResponse> filterByEventStatus(EventStatus eventStatus);
    List<LoggingHistoryResponse> filterByEventType(EventType eventType);
    List<LoggingHistoryResponse> getLogsFavoredByMe();
    List<LoggingHistoryResponse> getLogsManagedByMe();
    List<LoggingHistoryResponse> getAllEventsRelatedToMeOnly();
}
