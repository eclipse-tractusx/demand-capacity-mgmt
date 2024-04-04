

Table of Contents
  - [Table of Contents](#table-of-contents)
  - [Starting Point](#starting-point)
  - [Find Your Company](#find-your-company)
  - [Create Technical User](#create-technical-user)
  - [Register Connector](#register-connector)
    
  - [NOTICE](#notice)

## Eclipse Tractus-X Portal User Guide
https://github.com/eclipse-tractusx/portal-assets/blob/v1.8.0/docs/user

## DCM FOSS specific quickstart guide

<details>
  <summary>Click me to expand</summary>

## Starting Point

Before anything else, your company needs to registered on the Catena Portal, for that you can create an issues here: https://github.com/eclipse-tractusx/portal-frontend-registration

## Find Your Company

When you go to the Portal website that is relevant to you, you will find a screen similar to this:

![Portal Page](media/portal.png)

Then you can search for your company, using the search bar, in this case we will search for the company DCM, and this is what we are going to see:

![Portal Search Page](media/portal-search-company.png)

Now, if you click on your company, you will be redirected to the login page, where you can submit your credentials, given when you registered on the portal.

![Portal Login page](media/portal-login.png)

After the login, you will go to the Portal main page.

![Portal Main Page](media/portal-main-page.png)

## Create Technical User

To create a new Technical User for the EDC, click on the blue icon, on the right top side of your screen, and then select `User Management`.

![Portal Details ](media/portal-details.png)

You will then be redirected to the following page:

![Portal User Management Page](media/portal-user-management.png)

Click on `Technical User Management` and you will go to the following page:

![Portal Technical User Page](media/technical-user.png)

Select `Create Technical User`, and this window will appear:

![Portal Create Technical User Window](media/create-user.png)

Fill the forms with a `Name`, a `Description` and select `Identity Wallet Management`. 
Finally scroll down and select `confirm`.

And your user is now created.


## Register Connector

To register a new connector for the EDC, click on the blue icon, on the right top side of your screen, and then select `Technical Integration`.

![Portal Details ](media/portal-details.png)


You will be redirected to his page:

![Portal Connector](media/portal-connector.png)

On this page you can see every connector that you have previous registered and register a new one.
If we click on `Register Connector` the following window will open.

![Portal Register Connector First Window](media/portal-register-connector.png)

You will select `Connect company connector` and then `Next`.

After that, a new form will appear:

![Portal Register Connector Second Window](media/register-connector.png)

Fill the forms with a `Connector Name`, a `Connector URL/EndPoint` (Must be https) and a `Two Digit country code` (Must be in capital letters).
Finally select `confirm`.

And your connector is now registered.

</details>

## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: 2022,2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- SPDX-FileCopyrightText: 2022,2024 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/demand-capacity-mgmt/
