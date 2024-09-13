#!/bin/bash

LOCK_FILE="/tmp/deploy.lock"

# Function to send Discord notification
send_discord_notification() {
  local message="$1"
  curl -H "Content-Type: application/json" -X POST -d "{\"content\":\"$message\"}" "$DISCORD_WEBHOOK_URL"
}

# Set trap to handle script termination
cleanup() {
  echo "Deployment script terminated. Cleaning up."
  rm -f "$LOCK_FILE"
  exit 1
}

trap 'cleanup' INT TERM EXIT

# Check if lock file exists
if [ -f "$LOCK_FILE" ]; then
  existing_pid=$(cat "$LOCK_FILE")
  echo "Deployment in progress with PID $existing_pid. Terminating it."

  # Terminate the existing deployment process
  kill -TERM "$existing_pid"

  # Wait for the process to exit
  while kill -0 "$existing_pid" 2>/dev/null; do
    echo "Waiting for process $existing_pid to terminate..."
    sleep 1
  done

  # Remove the lock file
  rm -f "$LOCK_FILE"

  # Send Discord notification about cancellation
  send_discord_notification "⚠️ Previous deployment (PID $existing_pid) was canceled in favor of a new deployment."
fi

# Write current PID to lock file
echo "$$" > "$LOCK_FILE"

# Begin deployment
echo "Starting new deployment with PID $$."

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Ensure the network exists
docker network inspect sfcm-net >/dev/null 2>&1 || docker network create sfcm-net

# Deploy FE and BE using docker-compose
docker compose -f docker-compose.yaml up -d

echo "Front-end and back-end services are now running."

# Deployment completed
echo "Deployment completed successfully."

# Remove lock file
rm -f "$LOCK_FILE"

# Remove the trap
trap - INT TERM EXIT
