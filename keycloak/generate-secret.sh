#!/bin/sh

# Define the client name and the path to realm-export.json
CLIENT_NAME="dcmauth"
REALM_EXPORT_PATH="/etc/keycloak/realm-export.json"

# Fetch the secret and password from Vault
REQUEST_URL="$VAULT_ADDR/v1/$SECRET_PATH"
RESPONSE=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$REQUEST_URL")

SECRET=$(echo "$RESPONSE" | jq -r '.data.data.dcmsecr')
ADMIN_PASSWORD=$(echo "$RESPONSE" | jq -r '.data.data.adminsecpw')

# Exit if the secret or the password could not be fetched
if [ -z "$SECRET" ] || [ "$SECRET" == "null" ] || [ -z "$ADMIN_PASSWORD" ] || [ "$ADMIN_PASSWORD" == "null" ]; then
    echo "Failed to fetch the secret or the password from Vault"
    exit 1
fi

# Replace the secret in the realm-export.json and copy it to the correct location
jq --arg clientName "$CLIENT_NAME" --arg secret "$SECRET" '
  .clients |= map(
    if .clientId == $clientName then
      .secret = $secret
    else
      .
    end
  )
' $REALM_EXPORT_PATH > /tmp/temp-realm-export.json

# Replace the admin password in the realm-export.json
jq --arg password "$ADMIN_PASSWORD" '
  .users |= map(
    if .username == "DCM_ADMIN" then
      .credentials[0].value = $password
    else
      .
    end
  )
' /tmp/temp-realm-export.json > $REALM_EXPORT_PATH