#!/bin/sh

# Define the client name
CLIENT_NAME="dcmauth"

# Generate a new secret
SECRET=$(openssl rand -hex 32)

# Path to the realm-export.json
REALM_EXPORT_PATH="/etc/keycloak/realm-export.json"

# Check if the realm-export.json file exists at the specified path
if [ ! -f "$REALM_EXPORT_PATH" ]; then
    echo "realm-export.json does not exist at $REALM_EXPORT_PATH"
    exit 1
fi

# Find the client and replace the secret in the realm-export.json
jq --arg clientName "$CLIENT_NAME" --arg secret "$SECRET" '
  .clients |= map(
    if .clientId == $clientName then
      .secret = $secret
    else
      .
    end
  )
' $REALM_EXPORT_PATH > /tmp/temp-realm-export.json && cp /tmp/temp-realm-export.json $REALM_EXPORT_PATH

