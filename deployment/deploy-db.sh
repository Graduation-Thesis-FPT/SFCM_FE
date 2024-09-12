#!/bin/bash

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Deploy SQL Server using docker-compose
docker compose -f docker-compose.db.yaml up -d

# Wait for the SQL Server container to start
echo "Waiting for SQL Server to start..."
sleep 10

# Get the database user credentials from the .env file
DB_USER_NAME=$(grep '^DB_USER_NAME=' /root/capstone-new/SFCM_NEW_BE/.env | cut -d '=' -f2)
DB_PASSWORD=$(grep '^DB_PASSWORD=' /root/capstone-new/SFCM_NEW_BE/.env | cut -d '=' -f2)

# Correct file paths on the host
DELETE_DB_SCRIPT="/root/capstone-new/SFCM_NEW_BE/script/delete-db.sql"
GENERATE_TABLES_SCRIPT="/root/capstone-new/SFCM_NEW_BE/script/generate-tables.sql"
GENERATE_TRIGGERS_SCRIPT="/root/capstone-new/SFCM_NEW_BE/script/generate-triggers.sql"
GENERATE_MOCK_DATA_SCRIPT="/root/capstone-new/SFCM_NEW_BE/script/generate-mock-data.sql"

# Check if the SQL scripts exist on the host
if [ ! -f "$DELETE_DB_SCRIPT" ] || [ ! -f "$GENERATE_TABLES_SCRIPT" ] || [ ! -f "$GENERATE_TRIGGERS_SCRIPT" ] || [ ! -f "$GENERATE_MOCK_DATA_SCRIPT" ]; then
  echo "One or more SQL script files are missing on the host."
  exit 1
fi

# Copy SQL script files to the container
echo "Copying SQL script files to the container..."
docker cp "$DELETE_DB_SCRIPT" sfcm-db:/tmp/delete-db.sql
docker cp "$GENERATE_TABLES_SCRIPT" sfcm-db:/tmp/generate-tables.sql
docker cp "$GENERATE_TRIGGERS_SCRIPT" sfcm-db:/tmp/generate-triggers.sql
docker cp "$GENERATE_MOCK_DATA_SCRIPT" sfcm-db:/tmp/generate-mock-data.sql

# Run the script to delete the old SFCM database if it exists
echo "Checking and deleting the existing SFCM database if it exists..."
docker exec sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -i /tmp/delete-db.sql -C"

echo "Existing SFCM database deleted if it was present."

# Create a new SFCM database
docker exec sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -Q 'CREATE DATABASE SFCM;' -C"

echo "New SFCM database created successfully."

# Run the SQL scripts to generate mock data
docker exec sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -i /tmp/generate-tables.sql -C"
docker exec sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -i /tmp/generate-triggers.sql -C"
docker exec sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -i /tmp/generate-mock-data.sql -C"

echo "Mock data generated successfully."
