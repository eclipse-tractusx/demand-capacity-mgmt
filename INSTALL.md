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


Now that you have the application running let's work on the EDC.

-------------------------------------------------------------------------------
EDC

Go to https://portal.int.demo.catena-x.net/
Search for your portal company and login.

And now we need to create a user for the edc.

Click on the user icon, on the top right -> User Management -> Technical User Management -> Create Technical User

Choose the Username, the Description, select Data-space Discovery and then Click Confirm. And you have your user for EDC created!.

-------------------------------------------------------------------------------

On your IDE go to the folder charts/edc, you will find 3 folders, in each one you will have to edit the file values.yaml with the correct information form the previous step.

Then you can deploy those charts on argoCD.

-------------------------------------------------------------------------------

After having the EDC deployed, go back to https://portal.int.demo.catena-x.net/

Click on the user icon, on the top right -> Technical Integration -> Register Connector

Select Connect company connector and then next, fill with the connector name, the utl that the ingress form argo cd, and the two-digit code from your company country, and finally, confirm.

Now you have your edc deployed and registered, have fun!








