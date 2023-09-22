#!/bin/sh

# Define the client name and the path to realm-export.json
CLIENT_NAME="dcmauth"
REALM_EXPORT_PATH="/etc/keycloak/realm-export.json"

# Fetch the secret and password from Vault
REQUEST_URL="$VAULT_ADDR/v1/$SECRET_PATH"
RESPONSE=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$REQUEST_URL")

SECRET=$(echo "$RESPONSE" | jq -r '.data.data.dcmsecr')
ADMIN_PASSWORD=$(echo "$RESPONSE" | jq -r '.data.data.adminsecpw')
CUSTOMER_PASSWORD=$(echo "$RESPONSE" | jq -r '.data.data.customerpw')
SUPPLIER_PASSWORD=$(echo "$RESPONSE" | jq -r '.data.data.supplierpw')

# Exit if any of the secrets or passwords could not be fetched
if [ -z "$SECRET" ] || [ "$SECRET" == "null" ] ||
   [ -z "$ADMIN_PASSWORD" ] || [ "$ADMIN_PASSWORD" == "null" ] ||
   [ -z "$CUSTOMER_PASSWORD" ] || [ "$CUSTOMER_PASSWORD" == "null" ] ||
   [ -z "$SUPPLIER_PASSWORD" ] || [ "$SUPPLIER_PASSWORD" == "null" ]; then
    echo "Failed to fetch the secrets or the passwords from Vault"
    exit 1
fi

# Modify realm-export.json
jq --arg clientName "$CLIENT_NAME" --arg secret "$SECRET" \
   --arg adminPassword "$ADMIN_PASSWORD" --arg customerPassword "$CUSTOMER_PASSWORD" \
   --arg supplierPassword "$SUPPLIER_PASSWORD" '
  # Update client secret
  .clients |= map(
    if .clientId == $clientName then
      .secret = $secret
    else
      .
    end
  ) |
  # Update the passwords of existing users
  .users |= map(
    if .username == "DCM_ADMIN" then
      .credentials[0].value = $adminPassword
    elif .username == "CUSTOMER" then
      .credentials[0].value = $customerPassword
    elif .username == "SUPPLIER" then
      .credentials[0].value = $supplierPassword
    else
      .
    end
  )
' $REALM_EXPORT_PATH > /tmp/temp-realm-export.json

cat /tmp/temp-realm-export.json > $REALM_EXPORT_PATH