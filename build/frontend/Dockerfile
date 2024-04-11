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

# Stage 1: Node.js Build
FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Nginx Serving
FROM nginxinc/nginx-unprivileged:stable-alpine

ARG REPO_COMMIT_ID='REPO_COMMIT_ID'
ARG REPO_ENDPOINT_URL='REPO_ENDPOINT_URL'
ENV REPO_COMMIT_ID=${REPO_COMMIT_ID}
ENV REPO_ENDPOINT_URL=${REPO_ENDPOINT_URL}

USER root

RUN addgroup -g 3000 appgroup \
    && adduser -u 10000 -g 3000 -h /home/appuser -D appuser \
    && chown -R 10000:3000 /var/cache/nginx /var/run /var/log/nginx \
    && chmod -R 775 /var/cache/nginx /var/run /var/log/nginx

COPY ./entrypoint.sh /entrypoint.sh

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK NONE

USER 10000:3000

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
