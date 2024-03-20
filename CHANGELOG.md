# Changelog

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

All notable changes to this project will be documented in this file see also the overarching [`CHANGELOG.md`](https://eclipse-tractusx.github.io/changelog) for Tractus-X releases.

## [Unreleased]

### Application Endpoints Implemented:

#### User Management:
- Create year report: POST /year/report
- Post alerts: POST /alerts
- Retrieve alerts: GET /alerts
- Trigger alerts: POST /triggeredAlerts
- Retrieve triggered alerts: GET /triggeredAlerts
- Retrieve user details: GET /user
- Update user details: PUT /user

#### Logging History:
- Log events: POST /loggingHistory
- Retrieve logs: GET /loggingHistory
- Delete logs: DELETE /loggingHistory
- Filter logs: GET /loggingHistory/filterLogs
- Delete specific log: DELETE /loggingHistory/{log_id}
- Archive logs: POST /loggingHistory/archivedLog
- Retrieve archived logs: GET /loggingHistory/archivedLog
- Delete archived log: DELETE /loggingHistory/archivedLog
- Delete specific archived log: DELETE /loggingHistory/archivedLog/{log_id}

#### Favorites:
- Retrieve favorite material demands: GET /loggingHistory/favoriteMaterialDemands
- Retrieve favorite capacity groups: GET /loggingHistory/favoriteCapacityGroups
- Retrieve favorite items: GET /favorite
- Add item to favorites: POST /favorite
- Remove item from favorites: DELETE /favorite

#### Address Book:
- Retrieve address book: GET /addressBook
- Add contact to address book: POST /addressBook
- Delete contact from address book: DELETE /addressBook
- Query address book: GET /addressBook/query
- Update contact details: PUT /addressBook/{address_book_id}

#### Statuses:
- Create status: POST /statuses
- Retrieve statuses: GET /statuses
- Update status: PUT /statuses

#### Demand Management:
- Post demand: POST /demand
- Retrieve demand: GET /demand
- Retrieve demand series: GET /demand/series/{material_demand_id}
- Retrieve all demand series: GET /demand/series
- Create demand series: POST /demand/series
- Unlink demand series: POST /demand/series/unlink
- Retrieve specific demand: GET /demand/{demand_id}
- Update specific demand: PUT /demand/{demand_id}
- Delete specific demand: DELETE /demand/{demand_id}

#### Capacity Group Management:
- Link capacity group: POST /capacityGroup/link
- Retrieve all capacity groups: GET /capacityGroup
- Create capacity group: POST /capacityGroup
- Retrieve specific capacity group: GET /capacityGroup/{capacityGroup_id}
- Retrieve week-based capacity groups: GET /weekbasedcapacitygroup
- Create week-based capacity group: POST /weekbasedcapacitygroup
- Update week-based capacity group: PUT /weekbasedcapacitygroup/{weekBasedCapacity_id}
- Update week-based material demand: PUT /weekBasedMaterialDemand/{weekBasedMaterialDemand_id}
- Retrieve week-based material demand: GET /weekBasedMaterialDemand

### Additional Configurations and Connections:

#### Keycloak Configuration:
- Set up Keycloak for user authentication and authorization

#### Front-end Pages:
- Designed and implemented front-end pages:
  - Login page
  - Dashboard page
  - Reports page
  - Alerts page
  - User profile page
  - Address book page
  - Statuses page
  - Favorites page

#### Backend-Frontend Connection:
- Established connection between backend and frontend:
  - Integrated API endpoints with front-end components
  - Implemented data fetching and updating functionalities
  - Ensured secure communication and data transfer

#### Testing:
- Implemented front-end and back-end tests to ensure functionality and reliability
- All tests passing without errors
