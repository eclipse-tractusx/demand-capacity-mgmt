Table of contents:

# Code Dependencies
## Alerts
### Works
- Alert Trigger on Capacity Group update and Material Demand
- Alert Creation with custom Abolute and Relative values.

### Related 
    - AlertEntity
    - AlertsController
    - AlertsRepository
    - AlertsService
    - AlertsServiceImplementation


## Material Demands
### Works
- User can Create, update, delete, retrieve material demands.
- Triggers alerts based on changes in demand values and handles alert notifications.

### Related 
    - MaterialDemandEntity
    - DemandController
    - MaterialDemandRepository
    - DemandService
    - DemandServiceImplementation


## Capacity Group
### Works
- User can Create, update, delete, retrieve capacity groups.
- link maerial demands to capacity groups.

### Related 
    - CapacityGroupEntity
    - CapacityGroupsController
    - CapacityGroupRepository
    - CapacityGroupService
    - CapacityGroupServiceImplementation

## Company System
### Works
- User can Create, update, delete, retrieve capacity groups.

### Related 
    - CompanyEntity
    - CompanyController
    - CompanyRepository
    - CompanyService
    - CompanyServiceImplementation

## AddressBook
### Works
- User can create, delete, update addressbook.
- User can retrieve, add, edit contacts information.

### Related 
    - AddressBookRecordEntity
    - AddressBookController
    - AddressBookRepository
    - AddressBookService
    - AddressBookServiceImplementation


## Logging History
### Works
- A log wil be saved to the database when a user movement(ex:demand or CG creation or any other change).
- User can archive log, and view all the archived logs on a seperate view.

### Related 
    - LoggingHistoryEntity
    - LoggingHistoryController
    - LoggingHistoryRepository
    - LoggingHistoryService
    - LoggingHistoryServiceImplementation

## Favorites
### Works
- create favorited items fo CG, material demands, addressbook, company, events...
- User can filter favorites based on its type.

### Related 
    - FavoriteEntity
    - FavoriteController
    - FavoriteRepository
    - FavoriteService
    - FavoriteServiceImpl

## Statuses
### Works
- 
- Alert Creation with custom Abolute and Relative values.

### Related 
    - StatusesEntity
    - StatusesController
    - StatusesRepository
    - StatusesService
    - StatusesServiceImplementation    


## EDC
### Works
- Alert Trigger on Capacity Group update and Material Demand
- Alert Creation with custom Abolute and Relative values.

### Related 
    - EDCService
    - EDCServiceImplementation    
    
## Exception Handling
### Works
- Returning the front-end a combination of numbers to determine specific error causes.

### Related 
    - RestExceptionHandler
    - CustomException
    - ExceptionResponse
    - ExceptionResponseImpl
    - BadRequestException
    - InternalServerErrorException
    - NotFoundException



## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- Licence Path: https://creativecommons.org/licenses/by/4.0/legalcode
- Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
- Copyright (c) 2022, 2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- Source URL: https://github.com/catenax-ng/tx-demand-capacity-mgmt/
