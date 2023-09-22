FROM jboss/keycloak:latest

USER root
RUN microdnf install -y jq

COPY keycloak/generate-secret.sh /config/generate-secret.sh
RUN chmod +x /config/generate-secret.sh

