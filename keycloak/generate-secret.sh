#!/bin/bash

# Define the client name
CLIENT_NAME="dcmauth"

# Generate a new secret
SECRET=$(openssl rand -hex 32)

# Find the client and replace the secret in the realm-export.json
jq --arg clientName "$CLIENT_NAME" --arg secret "$SECRET" '
  .clients |= map(
    if .clientId == $clientName then
      .secret = $secret
    else
      .
    end
  )
' realm-export.json > temp-realm-export.json && mv temp-realm-export.json realm-export.json
