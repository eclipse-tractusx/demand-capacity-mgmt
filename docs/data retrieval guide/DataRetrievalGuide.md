
Table of Contents
- [ Catena-X Data Retrieval Guide](#-catena-x-data-retrieval-guide)
  - [Table of Contents](#table-of-contents)
  - [Starting Point](#starting-point)
    - [Available Central Services](#available-central-services)
  - [Problems Generated](#problems-generated)
  - [Data Retrieval Flow](#data-retrieval-flow)
    - [1. Discovery Phase](#1-discovery-phase)
    - [2. Digital Twin Registry Search Phase](#2-digital-twin-registry-search-phase)
    - [3. Digital Twin Search Phase](#3-digital-twin-search-phase)
    - [4. Data Negotiation and Transfer Phase](#4-data-negotiation-and-transfer-phase)
  - [1. Discovery Phase + 2. Digital Twin Registry Search Phase](#1-discovery-phase--2-digital-twin-registry-search-phase)
    - [Prerequisites](#prerequisites)
    - [Sequence Diagram](#sequence-diagram)
    - [Flow Diagram](#flow-diagram)
  - [3. Digital Twin Search Phase](#3-digital-twin-search-phase-1)
    - [Prerequisites](#prerequisites-1)
    - [Sequence Diagram](#sequence-diagram-1)
    - [Flow Diagram](#flow-diagram-1)
  - [4. Data Negotiation and Transfer Phase](#4-data-negotiation-and-transfer-phase-1)
    - [Prerequisites](#prerequisites-2)
    - [Sequence Diagram](#sequence-diagram-2)
    - [Flow Diagram](#flow-diagram-2)
      - [Negotiation and Transfer](#negotiation-and-transfer)
      - [Data Retrieval](#data-retrieval)
  - [NOTICE](#notice)

## Starting Point

Before we start with the diagrams is necessary to give some context and remark how things are happening and which services are available.

After the Digital Twin Registry became an decentral component provided by several Catena-X Members as Providers, there was the need of providing central services to enable searching for this digital twin registries.

Therefore some central services were created, allowing the authorized Catena-X Applications to find the EDC endpoints after calling the following services:

### Available Central Services


| Service Name | Description | Reference Implementation |
|------------- | ----------- | ------------------------ |
| Discovery Service | Responsible to give the search endpoints for a type of id | [eclipse-tractusx/sldt-discovery-finder](https://github.com/eclipse-tractusx/sldt-discovery-finder) |
| BPN Discovery	| Responsible for indicating the BPNs for the IDs registered by the providers | [eclipse-tractusx/sldt-bpn-discovery](https://github.com/eclipse-tractusx/sldt-bpn-discovery) |
| EDC Discovery	| Responsible for giving the EDC endpoints of one or more BPNs | [eclipse-tractusx/portal-backend](https://github.com/eclipse-tractusx/portal-backend) - [Code Implementation](https://github.com/eclipse-tractusx/portal-backend/blob/aca855c857aed309cbca03f4f694283629197110/src/administration/Administration.Service/Controllers/ConnectorsController.cs#L178C1-L190C63) |


The main idea was that they will be called in a sequential way when needed to find the EDC endpoints.

Here we can observe an example of how a normal exchange would work in a sequential way:

![Simplified Discovery Services Exchange](media/discoveryServices.drawio.svg)

## Problems Generated

After the fist implementations have been released, it was analyzed that some problems were generated.

The problems observed from the application side were: 

- dDTR search guidelines are missing:
    - After we receive the list of several EDCs, there is no guideline on the most optimized way of searching which EDC has the digital twin registry asset.
- Performance problem:
   - There is a performance problem, because if you want to find the digital twin registries for each request + search in each digital twin registry for the assets (which involves contract negotiation with EDCs) takes time.
- Escalation and Maintenance problem:
   - If we scale it in to the Catena-X Overarching project, we will observe that every product implemented their own solution. From a maintenance perspective the is big problem.
   - Imagine a new update in the EDC is made or in any other central discovery service, this would mean that every single application would need to change their architecture and code because they are responsible of maintaining it.

Therefore there needs to be a easier way of querying this services and searching in different dDTRs around the Catena-X Network.

## Data Retrieval Flow

Here is a diagram of the data retrial flow necessary to retrieve any data from the Catena-X Network without any optimizations:

![Data Retrieval Flow](media/dataRetrievalFlow.drawio.svg)


### 1. Discovery Phase

At the beginning we start calling the `Discovery Service` which is responsible for giving us the urls from the `BPN Discovery` and the `EDC Discovery` this two service give us first a `BPN or Business Partner Number` for a specific `id` and the `EDC Discovery` will give you a list of EDC registered by one company's `BPN`.

### 2. Digital Twin Registry Search Phase

Once we have a list of `EDCs` we need to find which of this EDCs contain the `Digital Twin Registry` component. We can filter which `EDCs` contain the `Digital Twin Registry` by simply calling for the catalog with the `type` condition of the contract that must have the `data.core.digitalTwinRegistry` standardized type. 

Once we have the list of DTRs we need to negotiate each contract retrieve in the catalog so that we can have the `Contract Agreement Id` which is given by the EDC once the contact is signed and agreed. This id will be used later to request the transfer for the `EDR` token for accessing the `Digital Twin Registry` through the `EDC Provider Data Plane Proxy`. 

### 3. Digital Twin Search Phase

We need to search for the `Digital Twins` inside of the `Digital Twin Registries`, and once we found it we can start the negotiation for the `submodelDescriptor`.

### 4. Data Negotiation and Transfer Phase

Once we have the submodel we are going to call the [`subprotocolBody`](#L233) url of the `endpoint interface` with name `SUBMODEL-3.0`. This will provide for us the asset id to negotiate with the EDC Provider. Once this asset is negotiated we will request for the `transfer` and `EDR` token will be sent to the backend by the EDC Provider, allowing us to query the dataplane url contained in the `href` field of the endpoint interface. And in this way we will retrieve the data using the `EDC Provider Data Plane Proxy`.


## 1. Discovery Phase + 2. Digital Twin Registry Search Phase

After the discovery phase, the search for digital twin registries is one of the core components to be done when retrieving data in Catena-X.
Once the negotiation for the digital twin registries assets are done we would be able to retrieve a catalog for the user to search the serialized Id.

### Prerequisites

The following information is required to enable the decentralized search for digital twin registries:

| Name | Example | Description |
| ---- | ------- | ----------- |
| Search Id Type | *manufacturerPartId* | The search id type is required first of all to know in which `BPN Discovery` services to search. It will be introduced in the `Discovery Service` and we will obtain a list of `BPN Discovery Endpoints`. After this same id will be introduce as the *`type`* attribute in each `BPN Discovery`. |
| Search Id Value | *HV-SPORT-123* | The search id value is required for searching in the `BPN Discovery` services. One example could be the `product type id` of a company, which is owned by an unique `BPN` reducing the complexity of the search.

### Sequence Diagram 
![Digital Twin Registries Search](media/dtrSearchSequence.drawio.svg)

As we can visualize in the following example we will request the following services and retrieve the contract agreement from the Digital Twin Registries in parallel.

### Flow Diagram
The flow diagram below allows us to see in more detail the steps required for retrieving the contract agreement id for each of the digital twin registries assets.

![Flow Digital Twin Registry Search](media/dtrSearchFlow.drawio.svg)


## 3. Digital Twin Search Phase

The digital twin searching phase involves searching in every digital twin registry for the desired digital twin asset. In this digital twin we will find the necessary information for requesting the contract information for the "digital twin submodels".

### Prerequisites

The following information is required for enabling the digital twin search, in order to start the data transfer phase:

| Name | Example | Description |
| ---- | ------- | ----------- |
| Specific Asset Id Type | *partInstanceId* | The specific asset id type is used to search in the `digital twin registry` for an specific digital twin. It is basically the `name` of  "specificAssetId" object located at the [`digital twin`](#aas-30-digital-twin-example) `specificAssetIds` property. The `*partInstanceId*` is used as an example most of the time, since the digital twin registry implemented a hotfix that allows companies say who can access to their `partInstanceId` fields. Now allowing the *"PUBLIC_READABLE"* property.   |
| Specific Asset Id Type | *BAT-XYZ789* | The specific asset id value is added in the `digital twin lookup` when calling the `EDC Provider Proxy`. It basically points to the value of the *`Specific Asset Id Type`* property.

### Sequence Diagram 
![Data Search API](media/dataSearchApi.drawio.svg)

### Flow Diagram 
![Data Search Flow API](media/searchApiFlow.drawio.svg)


## 4. Data Negotiation and Transfer Phase


### Prerequisites

The following information is required for enabling the digital twin search, in order to start the data transfer phase:

| Name | Example | Description |
| ---- | ------- | ----------- |
| Contract with Policy | [Contract Example](#contract-example) | To start the contract negotiation we need to agree on a policy for the a specific contract. This needs to be selected by the one that is requesting the data.


### Sequence Diagram
![Data Retrieval](media/dataRetrievalSequence.drawio.svg)

### Flow Diagram

#### Negotiation and Transfer
![Data Retrieval Flow 1](media/dataRetrievalFlow1.drawio.svg)

#### Data Retrieval

![Data Retrieval Flow 1](media/dataRetrievalFlow2.drawio.svg)

## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- Licence Path: https://creativecommons.org/licenses/by/4.0/legalcode
- Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
- Copyright (c) 2022, 2023 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- Source URL: https://github.com/eclipse-tractusx/tx-demand-capacity-mgmt/

