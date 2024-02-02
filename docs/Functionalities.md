

Demands System
* Manages functionalities related to material demand and capacity.
* Provides methods for creating, updating, retrieving, and deleting material demands.
* Manages demand series, customer, and supplier information, utilizing repositories like MaterialDemandRepository and DemandSeriesRepository for data storage.
* Enforces validation checks on material demand requests to ensure data integrity.
* Triggers alerts based on changes in demand values and handles alert notifications.


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

