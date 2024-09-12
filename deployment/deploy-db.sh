#!/bin/bash

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Deploy SQL Server using docker-compose
docker compose -f docker-compose.db.yaml up -d

# Wait for the SQL Server container to start
echo "Waiting for SQL Server to start..."
sleep 30

# Get the database user credentials from the .env file
DB_USER_NAME=$(grep '^DB_USER_NAME=' /root/capstone-new/SFCM_NEW_BE/.env | cut -d '=' -f2)
DB_PASSWORD=$(grep '^DB_PASSWORD=' /root/capstone-new/SFCM_NEW_BE/.env | cut -d '=' -f2)

# Run the script to delete the old SFCM database if it exists
echo "Checking and deleting the existing SFCM database if it exists..."
docker exec -i sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -C -i /root/capstone-new/SFCM_NEW_BE/script/delete-db.sql"

echo "Existing SFCM database deleted if it was present."

# Create a new SFCM database
docker exec -i sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -C -Q 'CREATE DATABASE SFCM; GO;'"

echo "New SFCM database created successfully."

# Run the SQL scripts to generate mock data
docker exec -i sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -C -i /root/capstone-new/SFCM_NEW_BE/generate-tables.sql"
docker exec -i sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -C -i /root/capstone-new/SFCM_NEW_BE/generate-triggers.sql"
docker exec -i sfcm-db bash -c "/opt/mssql-tools18/bin/sqlcmd -S localhost -U ${DB_USER_NAME} -P ${DB_PASSWORD} -C -i /root/capstone-new/SFCM_NEW_BE/generate-mock-data.sql"

echo "Mock data generated successfully."
