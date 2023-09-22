FROM jboss/keycloak:latest

COPY ./keycloak/generate-secret.sh /config/generate-secret.sh
RUN chmod +x /config/generate-secret.sh
