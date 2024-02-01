# Data Service Helm Chart

## Overview
This Helm chart deploys the Data Service, a component required by the Eclipse Dataspace Connector. The Backend Application utilizes the HTTP-TransferMethod for data transfer.

## Prerequisites
Before deploying this Helm chart, ensure that the following prerequisites are met:

- **Kubernetes Version:** 1.19+
- **Helm Version:** 3.2.0+

## Chart Details
- **Chart Name:** data-service
- **Chart Type:** Application
- **Chart Version:** 0.0.1
- **Application Version:** "0.0.1"

## Installation Steps
1. **Clone the Helm chart repository:**
    ```bash
    git clone [repository_url]
    cd data-service
    ```

2. **Install the Helm chart:**
    ```bash
    helm install data-service .
    ```

## Configuration
Review the [values.yaml](./values.yaml) file for configurable parameters and their default values. Customize these values as needed.

## Uninstallation
To uninstall/delete the Data Service release:

```bash
helm uninstall data-service
