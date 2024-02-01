# Tractus-X Eclipse Data Space Connector Helm Chart

## Overview
This Helm chart deploys the Tractus-X Eclipse Data Space Connector (DCM) Provider. This chart is a test mock that can be used as an EDC consumer for the DCM application.

## Prerequisites
Before deploying this Helm chart, ensure that the following prerequisites are met:

- **Kubernetes Version:** 1.19+
- **Helm Version:** 3.2.0+

## Copyright and License
This Helm chart is distributed under the terms of the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.

## Chart Details
- **Chart Name:** dcm-edc-provider
- **Chart Type:** Application
- **Chart Version:** 0.3.3
- **Application Version:** "0.5.0"
- **Home:** [Tractus-X EDC GitHub Repository](https://github.com/eclipse-tractusx/tractusx-edc/tree/main/charts/tractusx-connector)
- **Sources:** [GitHub Repository](https://github.com/eclipse-tractusx/tractusx-edc/tree/main/charts/tractusx-connector)
- **Chart URL:** [Tractus-X EDC Release](https://github.com/eclipse-tractusx/tractusx-edc/releases/download/tractusx-connector-0.5.0/tractusx-connector-0.5.0.tgz)

## Dependencies
This chart has dependencies on the following charts:

1. **Tractus-X Connector Chart**
   - **Version:** 0.5.0
   - **Repository:** [Tractus-X Helm Charts](https://eclipse-tractusx.github.io/charts/dev)
   - **Condition:** Enabled

2. **PostgreSQL Chart**
   - **Alias:** postgresql
   - **Version:** 12.1.6
   - **Repository:** [Bitnami Helm Charts](https://charts.bitnami.com/bitnami)
   - **Condition:** postgresql.enabled

## Installation Steps
1. **Add Helm repositories:**
    ```bash
    helm repo add tractusx https://eclipse-tractusx.github.io/charts/dev
    helm repo add bitnami https://charts.bitnami.com/bitnami
    ```

2. **Update Helm repositories:**
    ```bash
    helm repo update
    ```

3. **Install the Helm chart:**
    ```bash
    helm install dcm-edc-provider tractusx/dcm-edc-provider
    ```

## Configuration
Review the [values.yaml](./values.yaml) file for configurable parameters and their default values. Customize these values as needed.

## Uninstallation
To uninstall/delete the DCM EDC Provider release:

```bash
helm uninstall dcm-edc-provider
