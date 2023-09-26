FROM jboss/keycloak:latest
ENV DOCKERIZE_VERSION v0.6.1
USER root
RUN microdnf install -y jq wget

# Copy the scripts to the container
COPY keycloak/generate-secret.sh /config/generate-secret.sh

# Make the scripts executable
RUN chmod +x /config/generate-secret.sh

# Switch back to the jboss user
USER jboss