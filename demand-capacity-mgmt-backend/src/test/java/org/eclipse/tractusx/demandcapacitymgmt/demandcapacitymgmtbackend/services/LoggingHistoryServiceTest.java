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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LoggingHistoryRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.LoggingHistoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class LoggingHistoryServiceTest {

    @InjectMocks
    private LoggingHistoryServiceImpl loggingHistoryService;

    @Mock
    private LoggingHistoryRepository loggingHistoryRepository;

    private final LoggingHistoryRequest loggingHistoryRequest = createLoggingHistoryRequest();

    @Test
    void shouldCreateStatusesObject() {
        loggingHistoryService.createLog(loggingHistoryRequest);

        verify(loggingHistoryRepository, times(1)).save(any());
    }

    LoggingHistoryRequest createLoggingHistoryRequest() {
        LoggingHistoryRequest loggingHistoryRequest1 = new LoggingHistoryRequest();
        LocalDateTime currentLocalDateTime = LocalDateTime.now();
        loggingHistoryRequest1.setTimeCreated(Timestamp.valueOf(currentLocalDateTime).toString());
        loggingHistoryRequest1.setIsFavorited(true);
        loggingHistoryRequest1.setUserAccount("User@gmail.com");
        loggingHistoryRequest1.setEventDescription("Capacity Group ");
        loggingHistoryRequest1.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryRequest1.setObjectType(EventObjectType.CAPACITY_GROUP.toString());
        return loggingHistoryRequest1;
    }
}
