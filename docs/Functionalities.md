

Demands System:

* Manages functionalities related to material demand and capacity.
* Provides methods for creating, updating, retrieving, and deleting material demands.
* Manages demand series, customer, and supplier information, utilizing repositories like MaterialDemandRepository and DemandSeriesRepository for data storage.
* Enforces validation checks on material demand requests to ensure data integrity.
* Triggers alerts based on changes in demand values and handles alert notifications.


Capacity System:

* Handling the creation, retrieval, and linking of capacity groups.
* Manages the creation of capacity groups, enriching them with details such as customer, supplier, capacity names, and date ranges.
* Utilizes repositories like MaterialDemandRepository, LinkedCapacityGroupMaterialDemandRepository, and CapacityGroupRepository for data storage.
* Calculates and updates bottleneck status and to-do lists based on capacity group changes.
* Integrates with various services such as CompanyService, LoggingHistoryService, FavoriteService, and others to provide comprehensive functionality.


Alerts System:

* Provides functionalities for configuring, triggering, and retrieving alerts.
* Manages different types of alerts, including global and dedicated alerts.
* Utilizes repositories (AlertsRepository and TriggeredAlertsRepository) for data storage.


AddressBook System:

* Offering functionalities for managing address book records.
* Handles operations like retrieving, creating, updating, and deleting address book records.
* Collaborates with the AddressBookRepository for data storage and retrieval.
* Provides methods to retrieve a single record, all records, create a new record, update an existing record, and delete a record.


Logging History System:

* Providing functionalities for managing logging history.
* Manages logging operations, including creating, retrieving, and deleting logs.
* Utilizes repositories (LoggingHistoryRepository and ArchivedLogsRepository) for data storage.
* Collaborates with the FavoriteService for filtering logs based on favorite material demands and capacity groups.
* Handles archiving of logs in the archivedLogsRepository.
* Supports operations such as creating logs, retrieving all logs, filtering logs, and archiving logs.
* Includes methods for filtering logs based on material demand or capacity group.


Favorites System: 

* Providing functionalities for managing user favorites.
* Manages favorites related to capacity groups, material demands, companies, events, and address books.
* Utilizes repositories (FavoriteRepository, CapacityGroupRepository, MaterialDemandRepository, LinkedCapacityGroupMaterialDemandRepository, CompanyRepository, LoggingHistoryRepository, and AddressBookRepository) for data storage.
* Supports operations such as retrieving all favorites, retrieving favorites by type, creating favorites, and deleting favorites.
* Handles various favorite types, including capacity groups, material demands, companies, events, and address books.

Statuses System: 

* Defining methods for posting, retrieving, and updating user-specific status information.
* Utilizes the StatusesRepository for database interaction, allowing the storage and retrieval of user-specific status entities.
* Includes methods such as `postStatuses`, `getAllStatuses`, and `updateStatus` for managing and updating the user's status information.

EDC System:

* Responsible for interacting with an external service for managing assets, policies, contracts, and transfer processes. Below are the key features and functionalities of this class:
* Implements the EDCService interface, defining methods for creating, retrieving, and deleting various entities such as assets, policies, contracts, transfer processes, and EDRs (Endpoint Data References).
* Utilizes Spring WebFlux's WebClient for making reactive HTTP requests to the external service.
* Defines methods such as `createAsset`, `createPolicy`, `createContractDef`, `createCatalogRequest`, `createContractNeg`, `createTransferProcess`, `createEDR`, and `createAASRequest` for creating different entities.
* Includes methods such as `getAsset`, `getPolicy`, `getContractDef`, `getTransferProcess`, `getEDR`, and `getEDRSByParameters` for retrieving entities based on their identifiers or parameters.
* Provides methods like `deleteAsset`, `deletePolicy`, `deleteContractDef`, `deleteEDR`, and `addOrSubtractTodos` for deleting entities or performing other operations.

Company System: 

The `CompanyServiceImpl` class is an implementation of the CompanyService interface, responsible for managing company-related operations such as creating, retrieving, and deleting companies. Below are the key features and functionalities of this class:

• Implements the CompanyService interface, defining methods for creating, retrieving, and deleting companies, as well as converting between entity and DTO representations.
• Provides methods such as `createCompany`, `getCompanyById`, `deleteCompany`, `getCompanyIn`, `getAllCompany`, and `getTopCompanies` for performing CRUD (Create, Read, Update, Delete) operations on companies.
• Defines a private method `postLogs` for posting logging history when a company is created or deleted, using the LoggingHistoryService.
• Keeps track of the count of company accesses, updating it whenever a company is retrieved.


