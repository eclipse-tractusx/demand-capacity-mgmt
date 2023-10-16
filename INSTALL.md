Prerequisites:
- Ensure you have both Helm and Kind installed.

Installing Helm:

Helm is the package manager for Kubernetes. You can get helm from here: https://github.com/helm/helm/releases

-------------------------------------------------------------------------------

Installing Kind:

Kind stands for "Kubernetes in Docker". It's used for running local Kubernetes clusters using Docker containers as nodes. And you can get it from here: https://kind.sigs.k8s.io/docs/user/quick-start/

Now that you have Helm and Kind installed, let's create a cluster, this way we can run the helms charts.

For that we run the following command on a terminal:

    kind create cluster --name {NAME_OF_CLUSTER}

And then you can see your cluster by entering:

    kind get clusters

-------------------------------------------------------------------------------

Now that you saw your cluster follow the steps below to install the DCM application.

To install the images we need to run this command on the root folder:

    helm install dcm ./charts/demand-capacity-management 


Now that you have the application running let's work on the MIW.

-------------------------------------------------------------------------------

For that we will need a version of MIW running that you can now open a terminal and paste:

    git clone https://github.com/eclipse-tractusx/managed-identity-wallet

On your IDE open the MIW project and open charts/values

You need to change:

- authorityWallet.bpn: BPN of your company

Here in this file there is also other options that you can play with such as requests.requests.


And then on the terminal:

    cd managed-identity-wallet/charts/managed-identity-wallet
    helm dependency build
    helm install miw .

Wait a little bit for the pod to be up and running after that run:

    kubectl port-forward {POD_NAME} 9000:8080

To see the pod's name open a new terminal and enter:

    kubectl get pods -A

To see in which port he is running enter: 

    kubectl get services

Now if you go to http://localhost:9000 you can see that your MIW instance is running.

-------------------------------------------------------------------------------

Now for the EDC we will need an instance of keycloak running, and for that you can run the following command on the terminal:

    docker run -p 8080:8080 -e KEYCLOAK_ADMIN={choose} -e KEYCLOAK_ADMIN_PASSWORD={choose} quay.io/keycloak/keycloak:22.0.4 start-dev

And then go to http://localhost:8080 and then Administration Console, and log with the user and password that you choose on previous command.
After that, click on master on the left side, and choose Create Realm -> Browse -> {your_computer_path}\managed-identity-wallet\dev-assets\docker-environment\keycloak\miw_test_realm_local.json -> create

Now that you have your realm created, go to Realm settings on the bottom left, and then on Endpoints open: OpenID Endpoint Configuration, you will need this for later, for ssi.oauth.tokenurl.

-------------------------------------------------------------------------------

Still for the edc go to https://centralidp.int.demo.catena-x.net/auth/realms/CX-Central/protocol/openid-connect/auth?client_id=Cl2-CX-Portal&redirect_uri=https%3A%2F%2Fportal.int.demo.catena-x.net%2Ftechuserdetails%2Fa76bf67a-ffd4-4647-8699-070312cef9b6&state=3ebf0332-fba4-4bbb-b89b-567f385e9820&response_mode=fragment&response_type=code&scope=openid&nonce=6a02c519-b57e-4c40-9d0d-744d5b4c7ea4&code_challenge=7QetODkKyomOr3skQhicyt1-WtPb-nD1-NaQL08Vz5g&code_challenge_method=S256
Search for your portal company and login.

And now we need to create a user for the edc.

Click on the user icon, on the top right -> User Management -> Technical User Management -> Create Technical User

Choose the Username, the Description, select Identity Wallet Management and then Click Confirm. And you have your user for MIW created!.

-------------------------------------------------------------------------------

We are almost ready to run the EDC.

for that open a terminal and enter:

    git clone https://github.com/eclipse-tractusx/tractusx-edc

On your IDE open the EDC project and open charts/tractusx-connector-memory/values

You need to change:

- participant.id: BPN of your company 
- ssi.miw.url: http://localhost:9000
- ssi.miw.authorityId: BPN of your company
- ssi.oauth.tokenurl: OpenID Endpoint Configuration link
- ssi.oauth.client.id: id of your MIW user
- secretAlias: "client-secret" #The alias under which the client secret is stored in the vault.

then on the terminal: 

    cd charts/tractusx-connector-memory
    helm repo add tractusx-edc https://eclipse-tractusx.github.io/charts/dev
    helm install edc . --set vault.secrets="client-secret:$YOUR_CLIENT_SECRET"

Now just wait a little bit, and you have your instance of EDC up and Running






