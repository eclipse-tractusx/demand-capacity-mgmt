Table of Contents

- [Demands System](#demands-system)
- [Capacity System](#capacity-system)
- [Alerts System](#alerts-system)
- [Company System](#company-system)
- [AddressBook System](#addressbook-system)
- [Logging History System](#logging-history-system)
- [Favorites System](#favorites-system)
- [Statuses System](#statuses-system)
- [EDC System](#edc-system)
- [License Information](#license-information)

# Functionalities


## Overview
NIS: Feature was not part of that particular standard version

NV: Not Verified

xyz%: Completion ratio in relation to the corresponding standard version


 
| Feature / Standard Version  | 23.09  | 24.03 | 24.05 | Feature not based on Standard |
|:-|:-|:-|:-|:-|
| Exchange MaterialDemand & WeekBasedCapacityGroup | 100% | NV | NV |
| Link MaterialDemand & WeekBasedCapacityGroup | 100% | 100% | NV |
| Compare MaterialDemand & WeekBasedCapacityGroup | 100% | 100% | NV |
| Supplier: Consume MaterialDemand | 100% | 100% | NV |
| Supplier: Provide WeekBasedCapacityGroup | 100% | 25% | NV |
| Supplier: Process MaterialDemand | 100% | 100% | NV |
| Supplier: Process WeekBasedCapacityGroup | 100% | 50% | NV |
| Customer: Consume WeekBasedCapacityGroup | 100% | 50% | NV |
| Customer: Provide MaterialDemand | 100% | 75% | NV |
| Customer: Process MaterialDemand | 100% | 75% | NV |
| Customer: Process WeekBasedCapacityGroup | 100% | 50% | NV |
| Customer & Supplier: Provide, Consume & Process Nesting of WeekBasedCapacityGroup | NIS | 25% | 0% |
| Customer & Supplier: Provide, Consume & Process Load Factors | NIS | 25% | 0% |
| Customer & Supplier: Provide, Consume & Process Simulated Delta-Production | NIS | 25% | 0% |
| Customer & Supplier: Provide, Consume & Process RequestForUpdate | NIS | 0% | 0% |
| Customer & Supplier: Provide, Consume & Process IdBasedComment | NIS | 0% | 0% |
| Customer & Supplier: Provide, Consume & Process Deactivation of WeekBasedCapacityGroup & MaterialDemand | NIS | NIS | 0% |
| Customer & Supplier: Provide, Consume & Process Supply Chain Disruption Notification | NIS| NIS | 0% |
| Customer & Supplier: Provide, Consume & Process Agreed Capacity | NIS| NIS | 0% |
| Customer & Supplier: Provide, Consume & Demand Volatility | NIS| NIS | 0% |
|Local Adress Book| NIS| NIS | NIS | 90%|
| Capacity Groups and Material Demand - Alerts | NIS| NIS | NIS | 65% |
| Event Logging and History| NIS| NIS | NIS | 90% |
| Favorites | NIS| NIS | NIS | 80% |
| Admin Panel | NIS| NIS | NIS | 20% |

---

## Demands System:

- Manages functionalities related to material demand management.
- Provides methods for creating, updating, retrieving, and deleting material demands.
- Manages demand series, customer, and supplier information, utilizing repositories like MaterialDemandRepository and DemandSeriesRepository for data storage.
- Enforces validation checks on material demand requests to ensure data integrity.
- Triggers alerts based on changes in demand values and handles alert notifications.
- Defines a private method `postLogs` for posting logging history when a material demand is created or deleted, linked or updated using the LoggingHistoryService.

        CX - 0047 DCM Data Model Material Demand & Capacity Group - 70% Implemented

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented

## Capacity System:

- Handling the creation, retrieval, and linking (demands) on capacity groups.
- Manages the creation of capacity groups, enriching them with details such as capacity on a per category basis and date range.
- Utilizes repositories like MaterialDemandRepository, LinkedCapacityGroupMaterialDemandRepository, and CapacityGroupRepository for data storage.
- Pre-Calculates bottleneck status and updates to-do lists based on capacity group changes.
- Triggers alerts based on changes in capacity values and handles alert notifications.
- Defines a private method `postLogs` for posting logging history when a capacity group is created or deleted, updated or with status changed using the LoggingHistoryService.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented


## Alerts System:

- Provides functionalities for configuring, triggering, and retrieving alerts.
- Manages different types of alerts, including global and dedicated alerts, with absolute or relative values.
- Utilizes repositories (AlertsRepository and TriggeredAlertsRepository) for data storage.

         CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented  

## Company System: 

- Defining methods for creating, retrieving, and deleting companies.
- Provides methods such as `createCompany`, `getCompanyById`, `deleteCompany`, `getCompanyIn`, `getAllCompany`, and `getTopCompanies` for performing CRUD (Create, Read, Update, Delete) operations on companies.
- Defines a private method `postLogs` for posting logging history when a company is created or deleted, using the LoggingHistoryService.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented


## AddressBook System:

- Offering functionalities for managing address book records for company information.
- Handles operations like retrieving, creating, updating, and deleting address book records.
- Allows user to add more direct contact information on Company Data.
- Collaborates with the AddressBookRepository for data storage.
- Provides methods to retrieve a single record, all records, create a new record, update an existing record, and delete a record.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented


## Logging History System:

- Providing functionalities for managing logging history to log the user actions.
- Manages logging operations, including creating, retrieving, and deleting logs.
- Utilizes repositories (LoggingHistoryRepository and ArchivedLogsRepository) for data storage.
- Handles archiving of logs in the archivedLogsRepository.
- Supports operations such as creating logs, retrieving all logs, filtering logs, and archiving logs.
- Includes methods for filtering logs based on material demand or capacity group.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented


## Favorites System: 

- Providing functionalities for managing user favorites.
- Manages favorite capacity groups, material demands, companies, events, and address books.
- Utilizes repositories (FavoriteRepository, CapacityGroupRepository, MaterialDemandRepository, LinkedCapacityGroupMaterialDemandRepository, CompanyRepository, LoggingHistoryRepository, and AddressBookRepository) for data storage.
- Supports operations such as retrieving all favorites, retrieving favorites by type, creating favorites, and deleting.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented



## Statuses System: 

- Defining methods for posting, retrieving, and updating status information for the capacity groups and material demands if there is a status improvement or a status reduction.
- Utilizes the StatusesRepository for database interaction, allowing the storage and retrieval of user-specific status entities.
- Includes methods such as `postStatuses`, `getAllStatuses`, and `updateStatus` for managing and updating the user's status information.

        CX - 0048 DCM API Material Demand & Capacity Group - 90% Implemented

## EDC System:

Responsible for interacting with an external service for managing assets, policies, contracts, and transfer processes and data. Below are the key features and functionalities of this class:
- Implements the EDCService interface, defining methods for creating, retrieving, and deleting various entities such as assets, policies and contracts.
- Defines methods such as `createAsset`, `createPolicy` and `createContractDef` for creating different entities.
- Includes methods such as `getAsset`, `getPolicy` and `getContractDef` for retrieving entities based on their identifiers or parameters.
- Provides methods like `deleteAsset`, `deletePolicy` and `deleteContractDef` for deleting entities or performing other operations.
- Handles all authorization requirements while connecting to EDC.
- For more information: https://github.com/eclipse-tractusx/tractusx-edc

        CX - 0048 DCM API Material Demand & Capacity Group - 85% Implemented



## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- Licence Path: https://creativecommons.org/licenses/by/4.0/legalcode
- Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
- Copyright (c) 2022, 2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- Source URL: https://github.com/eclipse-tractusx/tx-demand-capacity-mgmt/
