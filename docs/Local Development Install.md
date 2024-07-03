Table of Contents

1. [DCMFOSS Local Development Deployment](#dcmfoss-local-development-deployment)
   - [Prerequisites](#prerequisites)
   - [Guide](#guide)
      - [Cloning the repository](#cloning-the-repository)
      - [Open in your own IDE of choice](#open-in-your-own-ide-of-choice)
      - [Docker desktop](#docker-desktop)
      - [Running containers](#running-containers)
      - [Running project first time for init configs](#running-project-first-time-for-init-configs)
      - [Running Keycloak](#running-keycloak)
      - [Fetching the keycloak client credential](#fetching-the-keycloak-client-credential)
      - [Configure postman collection requests](#configure-postman-collection-requests)
      - [Run the front-end](#run-the-front-end)
   - [Postmand Collection](#Postman-collection)
   - [Notice](#notice)


# DCMFOSS Local Development Deployment


## Prerequisites

This guide assumes the following prerequisites are true.
It was built considering an updated windows build with docker running, but will try to provide general instructions.

  - Basic coding knowledge
  - Basic Docker/Kubernetes knowledge
  - JDK 17 ( or Higher)
  - Maven 'Spring Boot is compatible with Apache Maven 3.5 or above'
  - Git/Github Desktop
  - NodeJS installed
  - Yarn installed
  - Docker Desktop


## Guide:
Let's begin local development install!

- ### Cloning the repository
    Clone the repository from the url below

      git clone https://github.com/eclipse-tractusx/demand-capacity-mgmt.git
  
    ![Using Github desktop](images/dev/1.png "Cloning the repo")

- ### Open in your own IDE of choice
    Boot your IDE of choice and open the backend repo,
    add the specification as a module of the backend project.
    
    ![IntelliJ IDE](images/dev/2.png "resolving dependencies")

    ![IntelliJ IDE modules](images/dev/2_5.png "resolving dependencies")

  it is normal for startup to have errors, let your IDE finish configuring and download dependencies.

  go ahead and run a maven clean and install on the specification cycle.
  if it fails saying you don't have a JDK, choose JDK17 of your choice.

- ### Docker desktop

  Please refer to the official docker desktop installation guide: https://docs.docker.com/desktop/  
  Please refer to the official WSL Documentation: https://learn.microsoft.com/en-us/windows/wsl/

  <details>
  <summary>Click me to expand quickstart guide</summary>

      Before you run the project we need to setup Postgres and Keycloak.
    Let's begin with installing docker(if you are running windows make sure to use WSL2).
    After installing docker on your machine lets install postgres.
    if you get an error of Hyper V make sure **virtualization is enabled on your motherboard
    and if you're on windows, enable Hyper-V feature-**
    if you get an error of wsl update not supported
    download and install 

    https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi 
    
    open a powershell and type 

      wsl --set-default-version 2
    
    then try again

    ![Docker Desktop](images/dev/3.png "Docker install")
  </details>

### Backend environment setup
There is a script called `local-setup.sh` located in the project root directory.
If you use a UNIX based system, you can simply run the script by executing the following commands:

```sh
chmod +x local-setup.sh
source local-setup.sh
```

The execution will:

1 - Clean and Install maven dependencies
```sh
mvn clean install 
```
2 - Assign execution permissions to `create_keycloak_db.sh`
```sh
chmod +x ./dev/create_keycloak_db.sh
```
3 - Start docker containers for postgres and keycloak
```sh
docker compose up -d
```
> On this step, the execution creates a Keycloak container based on the configurations in the compose.yaml file. Initial configurations, including the creation of realms, clients, and users, are performed using the `dcm_realm.json` file.
    [Download keycloak realm json](realm-export.json)

4 - Install frontend dependencies
```sh
cd demand-capacity-mgmt-frontend
npm install --force --legacy-peer-deps
```
5 - Automatically configures local environment variable pertaining the client secret for application.yaml (keycloak > clientSecret)

> For manual setup, navigate to dcmauth client on keycloak panel and copy the client secret under credentials.
  Open your application.yaml and place it on the dcmsecr section. After that, run the project and in postman you should be able to login on the token endpoint with the credentials you modified on keycloak!

6 - Start the backend application
```sh
java -jar demand-capacity-mgmt-backend/target/demand-capacity-mgmt-backend-0.0.1-SNAPSHOT.jar
```

**Alternatively, you can manually follow all the above steps in sequence.**

  You can access keycloak on `http://localhost:28080/` and login with admin credentials configured in `compose.yaml` and modify users to you heart's content (under the users tabs, credentials for them, assing roles, etc)

  **Remember you need to have a user role on all users, it can be ADMIN, CUSTOMER, SUPPLIER**
  failing to have one of these roles won't let the user login in the app.

 ### Frontend environment setup
 If you have run step 4 from [Backend environment setup](#backend-environment-setup), then frontend dependencies should be already installed. Now, you can run: 

  ```sh
  npm start
  ```

  the app will be booted on localhost:3000

  > For a user to correctly login you need to add a company to the DB and add that company to the user
  Admin needs to have a company, even if a dummy one.
  otherwise you will get lowerCase error on frontend when trying to read company Ids

### Configure postman collection requests!
  Now, using postman, you should be able to login on the token endpoint with the credentials you modified on keycloak!

  ![Postman](images/dev/6.png "Postman login")

  for the other requests on postman you need to alter the authorization tab.
  check the config on the images provided.

  the access token url should be either the backend or in last resort if it fails, this one 
  **http://localhost:8888/auth/realms/dcm/protocol/openid-connect/token** 
  if an authorization error occurs, it most likely is the url error of keycloak, newer versions of keycloak you need to remove **/auth/** from the authorization url.

  ![Postman](images/dev/7.png "Postman config")

  ![Postman](images/dev/8.png "Postman config")

  ![Postman](images/dev/9.png "Postman config")

  ![Postman](images/dev/10.png "Postman config")


## Postman Collection

[Download Postman collection](DCMFOSS_postman.json)


## NOTICE

This work is licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

- SPDX-License-Identifier: Apache-2.0
- SPDX-FileCopyrightText: 2022,2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)
- SPDX-FileCopyrightText: 2022,2024 Contributors to the Eclipse Foundation
- Source URL: https://github.com/eclipse-tractusx/demand-capacity-mgmt/
