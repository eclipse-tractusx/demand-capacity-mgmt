#!/bin/bash

# Function to kill any process running on port 8080
kill_existing_java_process() {
  local PID
  PID=$(lsof -t -i:8080)
  if [ -n "$PID" ]; then
    echo "Killing existing process on port 8080 (PID: $PID)..."
    kill -9 $PID
    sleep 5
  else
    echo "No existing process running on port 8080."
  fi
}

maven_clean_install() {
  echo "Cleaning and installing Maven dependencies..."
  mvn clean install
}

set_executable_permissions() {
  echo "Setting executable permissions for create_keycloak_db.sh..."
  chmod +x ./dev/create_keycloak_db.sh
}

start_docker_containers() {
  echo "Starting Docker containers..."
  docker compose up -d
  echo "Waiting for containers to be fully up..."
  sleep 5
}

install_frontend_dependencies() {
  echo "Installing frontend dependencies..."
  cd demand-capacity-mgmt-frontend
  npm install --force --legacy-peer-deps
  cd ..
}

config_client_secret() {
  export DCMSECR=99efa50e0cde9e3b1f693e75d5623059e911ab6b26050192543cbf4cd19bc2d8
}

start_backend() {
  echo "Starting backend and running migrations..."
  java -jar demand-capacity-mgmt-backend/target/demand-capacity-mgmt-backend-0.0.1-SNAPSHOT.jar
}

main() {
  check_docker_running
  kill_existing_java_process
  maven_clean_install
  set_executable_permissions
  start_docker_containers
  install_frontend_dependencies
  config_client_secret
  start_backend
}

# LOCAL SETUP EXECUTION
main
