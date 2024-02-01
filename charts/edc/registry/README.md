# Tractus-X Digital Twin Registry Helm Chart

## Overview
This Helm chart deploys the Tractus-X Digital Twin Registry, a crucial component for managing digital twins. It serves as a registry for digital twin providers.

## Prerequisites
Before deploying this Helm chart, ensure that the following prerequisites are met:

- **Kubernetes Version:** 1.19+
- **Helm Version:** 3.2.0+

## Copyright and License
This Helm chart is distributed under the terms of the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.

## Chart Details
- **Chart Name:** registry
- **Chart Type:** Application
- **Chart Version:** 0.3.23

## Dependencies
This chart has a dependency on the Tractus-X Digital Twin Registry chart:

- **Provider Digital Twin Registry Chart**
   - **Alias:** provider-dtr
   - **Version:** 0.3.23
   - **Repository:** [Tractus-X Digital Twin Registry Helm Charts](https://eclipse-tractusx.github.io/sldt-digital-twin-registry)
   - **Condition:** Enabled

## Installation Steps
1. **Add Helm repository:**
    ```bash
    helm repo add tractusx https://eclipse-tractusx.github.io/sldt-digital-twin-registry
    ```

2. **Update Helm repositories:**
    ```bash
    helm repo update
    ```

3. **Install the Helm chart:**
    ```bash
    helm install registry tractusx/registry
    ```

## Configuration
Review the [values.yaml](./values.yaml) file for configurable parameters and their default values. Customize these values as needed.

## Uninstallation
To uninstall/delete the Digital Twin Registry release:

```bash
helm uninstall registry
