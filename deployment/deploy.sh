#!/bin/bash

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Ensure the network exists
docker network inspect sfcm-net >/dev/null 2>&1 || docker network create sfcm-net

# Deploy FE and BE using docker-compose
docker-compose -f docker-compose.yaml up -d

echo "Front-end and back-end services are now running."
