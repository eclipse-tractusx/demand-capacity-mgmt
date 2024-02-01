# Demand Capacity Management Helm Chart

## Overview
This Helm chart deploys the Demand Capacity Management application on a Kubernetes cluster. The Demand Capacity Management application is designed for [brief description of what the application does].

## Prerequisites
Before deploying this Helm chart, ensure that the following prerequisites are met:

- **Kubernetes Version:** 1.19+
- **Helm Version:** 3.2.0+
- **PV Provisioner:** Support in the underlying infrastructure

## License
This Helm chart is distributed under the terms of the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for additional information.

## Chart Details
- **Chart Name:** demand-capacity-management
- **Chart Type:** Application
- **Chart Version:** 0.1.0
- **Application Version:** "latest"

## Dependencies
This chart has a dependency on the PostgreSQL chart. Ensure that it is available in the specified repository before installing.

## Installation Steps
1. **Add Helm repository:**
    ```bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    ```

2. **Update Helm repositories:**
    ```bash
    helm repo update
    ```

3. **Install the Helm chart:**
    ```bash
    helm install demand-capacity-management bitnami/demand-capacity-management
    ```

## Configuration
Review the [values.yaml](./values.yaml) file for configurable parameters and their default values. Customize these values as needed.

## Uninstallation
To uninstall/delete the Demand Capacity Management release:

```bash
helm uninstall demand-capacity-management
