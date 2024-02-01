Table of content:

- [Demand and Capacity Management](#demand-and-capacity-management)
    - [Overview](#ov)
        - [Resilient Supply Chains](#resilient-supply-chains)
        - [Advantages for Everyone Involved](#advantages-for-everyone-involved)
- [Application](#application)
  - [Prerequisites](#prerequisites)
  - [How to Run](#how-to-run)
  - [Diagrams]()
    - [Components Architecture Diagram](#components-architecture-diagram)
    - [Roles and Capabilities Diagram](#roles-and-capabilites-diagram)
- [API Sample Endpoints](#api-sample-endpoints)

# Demand and Capacity Management

## Overview
Turbulence in the global economy, technological change, and limited availability of resources are impacting industries. Eclipse-Tractus-X, which hosts the components for a Catena-X network, enables a secure exchange of demand and capacity data of all partners involved in the automotive network: from raw material to n-tier suppliers to car manufacturers.

### Resilient Supply Chains

Demand and capacity management (BKM) is based on a collaborative process. Those who are part of the Catena-X network can securely share their demand and capacity data with other collaborators: with suppliers just as much as with automotive manufacturers and recyclers. The Catena-X ecosystem offers protected spaces with a common view of the data released. This enables the partners to react at an early stage to changes in plans and deviations and to jointly find a solution based on the situation.

Establishing a collaborative process significantly increases transparency and creates a more robust and resilient supply chain.

### Advantages for Everyone Involved

- Improved planning reliability and accuracy;
- Increased transparency about the demand and capacity situation as well as their fluctuations;
- Early detection of problems and the ability to avoid capacity bottlenecks;
- Less under/overproduction through better utilization;
- Reduced costs by avoiding expensive re-planning and improved material procurement;
- Increased delivery reliability and customer satisfaction.


# Application


### Prerequisites

* JDK 17 ( or Higher)
* Maven 'Spring Boot is compatible with Apache Maven 3.5 or above'
* Company registry on the CatenaX portal
* EDC Ednpoint


### How to run

To run the project locally

## Components Architecture Diagram

![Components Architecture](docs/images/ComponentsArchitecture.jpg "Components Architecture Diagram")

## Roles And Capabilites Diagram

![Roles and Capabilites](docs/images/PersonasAndCapabilities.jpg "Roles and Capabilities Diagram")



## API sample endpoints

* Swagger UI: `http://localhost:8080/swagger-ui/index.html#/`