Table of Contents

- [Code Dependencies](#code-dependencies)
    - [Alerts](#alerts)
    - [Material Demands](#material-demands)
    - [Capacity Group](#capacity-group)
    - [Company System](#company-system)
    - [AddressBook](#addressbook)
    - [Logging History](#logging-history)
    - [Favorites](#favorites)
    - [Statuses](#statuses)
    - [EDC](#edc)
    - [Exception Handling](#exception-handling)
- [Front-End](#frontend)
    - [NOTICE](#notice)

# Code Dependencies

## Alerts
### Functionality
- Implements alert triggers for capacity group updates and material demand changes.
- Allows creation of alerts with custom absolute and relative values.

### Related Components
        - AlertEntity
        - AlertsController
        - AlertsRepository
        - AlertsService
        - AlertsServiceImplementation

## Material Demands
### Functionality
- Enables CRUD operations for material demands.
- Triggers alerts based on changes in demand values and manages alert notifications.

### Related Components
        - MaterialDemandEntity
        - DemandController
        - MaterialDemandRepository
        - DemandService
        - DemandServiceImplementation

## Capacity Group
### Functionality
- Supports CRUD operations for capacity groups.
- Facilitates linking material demands to capacity groups.

### Related Components
        - CapacityGroupEntity
        - CapacityGroupsController
        - CapacityGroupRepository
        - CapacityGroupService
        - CapacityGroupServiceImplementation

## Company System
### Functionality
- Enables management of company-related operations.

### Related Components
        - CompanyEntity
        - CompanyController
        - CompanyRepository
        - CompanyService
        - CompanyServiceImplementation

## AddressBook
### Functionality
- Facilitates management of contacts and address book entries.

### Related Components
        - AddressBookRecordEntity
        - AddressBookController
        - AddressBookRepository
        - AddressBookService
        - AddressBookServiceImplementation

## Logging History
### Functionality
- Logs user activities and movements.
- Allows archiving and viewing of logged activities.

### Related Components
        - LoggingHistoryEntity
        - LoggingHistoryController
        - LoggingHistoryRepository
        - LoggingHistoryService
        - LoggingHistoryServiceImplementation
        - ArchivedLogEntity
        - ArchivedLogsRepository

## Favorites
### Functionality
- Enables users to create and manage favorites for various entities.
- Supports filtering of favorites based on entity types.

### Related Components
        - FavoriteEntity
        - FavoriteController
        - FavoriteRepository
        - FavoriteService
        - FavoriteServiceImpl

## Statuses
### Functionality
- Manages status updates for demand items.
- Facilitates retrieval and management of statuses.

### Related Components
        - StatusesEntity
        - StatusesController
        - StatusesRepository
        - StatusesService
        - StatusesServiceImplementation

## EDC
### Functionality
- Interfaces with external services for managing assets, policies, contracts, transfers, and data.

### Related Components
        - EDCService
        - EDCServiceImplementation

## Exception Handling
### Functionality
- Handles exceptions and error responses in the application.

### Related Components
        - RestExceptionHandler
        - CustomException
        - ExceptionResponse
        - ExceptionResponseImpl
        - BadRequestException
        - InternalServerErrorException
        - NotFoundException

# FrontEnd
The **Components** folder holds reusable building blocks of the application's user interface, such as components for managing address books, alerts, capacity groups, and more. Within each component folder, you'll find specific components related to that feature, like forms, tables, and modals. 

The **Contexts** folder contains context providers, which help manage application-wide data and state. 

**Interfaces** define the structure of data used in the application. 

The **Common** directory integrates, most of the commonly used components used throught each pages, such as Search bars and so on.

Finally, the **Util** folder contains utility functions and helpers that assist in various tasks throughout the application. This organized structure is a very simple approach to modularity and coponents, making it easier to navigate and maintain the codebase.

The **DCM**, folder integrates key components that are the base of the application. Such as the *AppLayout.tsx*, that contains the routing system that reidirects between pages,and their contexts that integrates them with their needed **dependencies**, the *Layout.tsx* that contains the base foundation of the whole web structure, with permanent items like the QuickAcessItems and the Menu, and finally the *ToastContainerComponent.tsx* that containes the Toast container, keeping toasts consistent across pages.

A component can be found on the relative folder to wich feature it integrates, consider the following structure:



```bash
├───components
│   ├───addessBook
│   │       AddressBookDetailsView.tsx
│   │       BoardView.tsx
│   │       CompaniesList.tsx
│   │       CompanyEditModal.tsx
│   │       ContactCardModal.tsx
│   │       ContactEditModal.tsx
│   │       ContactsList.tsx
│   │
│   ├───alerts
│   │       AlertsTable.tsx
│   │       ConfigureAlertModal.tsx
│   │       ConfiguredAlertsTable.tsx
│   │       RulesModal.tsx
│   │
│   ├───capacitygroup
│   │       BottleNeckModalComponent.tsx
│   │       CapacityGroupAddToExisting.tsx
│   │       CapacityGroupBottlenecks.tsx
│   │       CapacityGroupChronogram.tsx
│   │       CapacityGroupDemandsList.tsx
│   │       CapacityGroupsList.tsx
│   │       CapacityGroupsTableHeaders.tsx
│   │       CapacityGroupSumView.tsx
│   │       CapacityGroupWizardModal.tsx
│   │
│   ├───common
│   │       AlertMonitoredObjectsOptions.tsx
│   │       AlertThresholdTypeOptions.tsx
│   │       CompanyDetailsInteractionModal.tsx
│   │       CompanyOptions.tsx
│   │       DangerConfirmationModal.tsx
│   │       LoadingMessages.tsx
│   │       Pagination.tsx
│   │       QuickAcessItems.tsx
│   │       Search.tsx
│   │       StepsBreadCrumbs.tsx
│   │       TopMenu.tsx
│   │       UnitsofMeasureOptions.tsx
│   │
│   ├───dcm
│   │       AppComponent.tsx
│   │       Layout.tsx
│   │       ToastContainerComponent.tsx
│   │
│   ├───demands
│   │       DemandAddForm.tsx
│   │       DemandCategoryOptions.tsx
│   │       DemandDetailsModal.tsx
│   │       DemandEditForm.tsx
│   │       DemandList.tsx
│   │       DemandListTableHeaders.tsx
│   │       DemandManagement.tsx
│   │       DemandManagementTableHeaders.tsx
│   │       DemandsOverview.tsx
│   │
│   ├───events
│   │       EventsTable.tsx
│   │
│   ├───favorites
│   │       FavoritesTableAddressBook.tsx
│   │       FavoritesTableCapacityGroup.tsx
│   │       FavoritesTableCompanies.tsx
│   │       FavoritesTableEvents.tsx
│   │       FavoritesTableMaterialDemands.tsx
│   │
│   ├───menu
│   │       InfoMenu.tsx
│   │
│   └───pages
│           AdminPage.tsx
│           AdressBookPage.tsx
│           AlertsPage.tsx
│           AuthenticationPage.tsx
│           CapacityGroupDetailsPage.tsx
│           CapacityGroupPage.tsx
│           DownStatusPage.tsx
│           ErrorPage.tsx
│           EventsPage.tsx
│           FavoritesPage.tsx
│           ThresholdPage.tsx
│           TodoListPage.tsx
│           UpStatusPage.tsx
│
├───contexts
│       AdressBookContextProvider.tsx
│       AlertsContextProvider.tsx
│       BottlenecksContextProvider.tsx
│       CapacityGroupsContextProvider.tsx
│       CompanyContextProvider.tsx
│       DemandCategoryProvider.tsx
│       DemandContextProvider.tsx
│       EventsContextProvider.tsx
│       FavoritesContextProvider.tsx
│       InfoMenuContextProvider.tsx
│       ThresholdsContextProvider.tsx
│       UnitsOfMeasureContextProvider.tsx
│       UserContext.tsx
│       YearlyReportContextProvider.tsx
│
├───interfaces
│       addressbook_interfaces.tsx
│       alert_interface.tsx
│       capacitygroup_interfaces.tsx
│       company_interfaces.tsx
│       customer_interfaces.tsx
│       customoption_interface.tsx
│       demand_interfaces.tsx
│       event_interfaces.tsx
│       favorite_interfaces.tsx
│       infomenu_interfaces.tsx
│       supplier_interfaces.tsx
│       threshold_interfaces.tsx
│       user_interfaces.tsx
│
└───util
        Api.tsx
        Auth.tsx
        AuthApi.tsx
        AuthenticatedRoute.tsx
        Defaults.tsx
        ErrorMessagesHandler.tsx
        RefreshToken.tsx
        TypeGuards.tsx
        WeeksUtils.tsx
```



## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- Licence Path: https://creativecommons.org/licenses/by/4.0/legalcode
- Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
- Copyright (c) 2022, 2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- Source URL: https://github.com/catenax-ng/tx-demand-capacity-mgmt/
