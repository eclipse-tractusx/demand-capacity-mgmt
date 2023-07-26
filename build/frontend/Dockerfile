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



# Base image
FROM node:16.15.1

# Set the working directory
WORKDIR /app

# Copy the app source code
COPY ../../demand-capacity-mgmt-frontend .

# Install dependencies
RUN yarn install

# Build the app
RUN yarn build

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
