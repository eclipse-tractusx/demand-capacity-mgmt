

Alerts System:
• Provides functionalities for configuring, triggering, and retrieving alerts.
•	Manages different types of alerts, including global and dedicated alerts.
•	Utilizes repositories (AlertsRepository and TriggeredAlertsRepository) for data storage.


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



