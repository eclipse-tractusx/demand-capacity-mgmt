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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "statuses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusesEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", name = "id")
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "todos", referencedColumnName = "id")
    private StatusObjectEntity todos;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_improvment", referencedColumnName = "id")
    private StatusObjectEntity statusImprovment;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_degredation", referencedColumnName = "id")
    private StatusObjectEntity statusDegredation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "general", referencedColumnName = "id")
    private StatusObjectEntity general;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "overall_todos", referencedColumnName = "id")
    private StatusObjectEntity overAllTodos;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "overall_status_improvment", referencedColumnName = "id")
    private StatusObjectEntity overAllStatusImprovment;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "overall_status_degredation", referencedColumnName = "id")
    private StatusObjectEntity overAllStatusDegredation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "overall_general", referencedColumnName = "id")
    private StatusObjectEntity overAllGeneral;
}
