# Changelog

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

All notable changes to this project will be documented in this file see also the overarching [`CHANGELOG.md`](https://eclipse-tractusx.github.io/changelog) for Tractus-X releases.

## [Unreleased]

- Application endpoints that users can use:
  * Post: /year/report
  * Post: /alerts
  * Get: /alerts
  * Post: /triggeredAlerts
  * Get: /triggeredAlerts
  * Get: /user
  * Put: /user
  * Post: /loggingHistory
  * Get: /loggingHistory
  * Delete: /loggingHistory
  * Get: /loggingHistory/filterLogs
  * Delete: /loggingHistory{log_id}
  * Post: /loggingHistory/archivedLog
  * Get: /loggingHistory/archivedLog
  * Delete: /loggingHistory/archivedLog
  * Delete: /loggingHistory/archivedLog/{log_id}
  * Get: /loggingHistory/favoriteMaterialDemands
  * Get: /loggingHistory/favoriteCapacityGroups
  * Get: /addressBook
  * Post: /addressBook
  * Delete: /addressBook
  * Get: /addressBook/query
  * Put: /addressBook/{address_book_id}
  * Post: /statuses
  * Get: /statuses
  * Put: /statuses
  * Post: /demand
  * Get: /demand
  * Get: /demand/series/{material_demand_id}
  * Get: /demand/series
  * Post: /demand/series
  * Post: /demand/series/unlink
  * Get: /demand/{demand_id}
  * Put: /demand/{demand_id}
  * Delete: /demand/{demand_id}
  * Post: /capacityGroup/link
  * Get: /capacityGroup
  * Post: /capacityGroup
  * Get: /capacityGroup/{capacityGroup_id}
  * Get: /weekbasedcapacitygroup
  * Post: /weekbasedcapacitygroup
  * Put: /weekbasedcapacitygroup/{weekBasedCapacity_id}
  * Put: /weekBasedMaterialDemand/{weekBasedMaterialDemand_id}
  * Get: /weekBasedMaterialDemand
  * Post: /weekBasedMaterialDemand
  * Get: /favorite
  * Post: /favorite
  * Delete: /favorite
  * Get: /favorite/{type}