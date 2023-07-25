# *******************************************************************************
# Copyright (c) 2023 BMW AG
# Copyright (c) 2023 Contributors to the Eclipse Foundation
#
#   See the NOTICE file(s) distributed with this work for additional
#   information regarding copyright ownership.
#
#   This program and the accompanying materials are made available under the
#   terms of the Apache License, Version 2.0 which is available at
#   https://www.apache.org/licenses/LICENSE-2.0.
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#   WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#   License for the specific language governing permissions and limitations
#   under the License.
#
#   SPDX-License-Identifier: Apache-2.0
#   ********************************************************************************


FROM maven:3.9.0-eclipse-temurin-19 as build

COPY ./ ./

RUN mvn clean install

RUN mvn package

FROM eclipse-temurin:19-jdk-jammy

ARG USERNAME=dftuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update && apt-get install --no-install-recommends \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && rm -rf /var/lib/apt/lists/*


USER $USERNAME

WORKDIR /home/user/dftuser/dftapp


COPY --from=build demand-capacity-mgmt-backend/target/*.jar ./app.jar


EXPOSE 8080

CMD ["java", "-jar", "./app.jar","--spring.profile=${PROFILE}"]


