#!/bin/bash

LOCK_FILE="/tmp/deploy.lock"

# Function to send Discord embed notification
send_discord_embed() {
  local title="$1"
  local color="$2"
  local repo="$3"
  local branch="$4"
  local commit="$5"
  local time="$6"
  local additional_field="$7"

  curl -H "Content-Type: application/json" -X POST -d "$(jq -n \
    --arg title "$title" \
    --arg color "$color" \
    --arg repo "$repo" \
    --arg branch "$branch" \
    --arg commit "$commit" \
    --arg time "$time" \
    --arg additional "$additional_field" \
    '{
      embeds: [{
        title: $title,
        color: ($color | tonumber),
        fields: [
          { name: "Repository", value: $repo, inline: true },
          { name: "Branch", value: $branch, inline: true },
          { name: "Commit", value: "https://github.com/\($repo)/commit/\($commit)", inline: false },
          { name: "Time", value: "`\($time)`", inline: false },
          { name: "Additional Info", value: $additional, inline: false }
        ],
        timestamp: "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
        footer: { text: "Deployment System" }
      }]
    }')" "$DISCORD_WEBHOOK_URL"
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
  DEPLOYMENT_PID=$(grep '^DEPLOYMENT_PID=' $LOCK_FILE | cut -d '=' -f2)

  echo "Deployment in progress with PID $DEPLOYMENT_PID. Terminating it."

  # Terminate the existing deployment process
  kill -TERM "$DEPLOYMENT_PID"

  # Wait for the process to exit
  while kill -0 "$DEPLOYMENT_PID" 2>/dev/null; do
    echo "Waiting for process $DEPLOYMENT_PID to terminate..."
    sleep 1
  done

  # Remove the lock file
  rm -f "$LOCK_FILE"

  # Send cancellation notification
  send_discord_embed \
    "⚠️ Deployment Cancelled" \
    "15105570" \
    "$REPO_NAME" \
    "$BRANCH_NAME" \
    "$COMMIT_HASH" \
    "$DEPLOY_TIME" \
    "A new deployment has been initiated."
fi

# Write current PID to lock file
echo "DEPLOYMENT_PID=$$" >"$LOCK_FILE"
# Write environment variables to lock file
echo "REPO_NAME='$REPO_NAME'" > "$LOCK_FILE"
echo "BRANCH_NAME='$BRANCH_NAME'" >> "$LOCK_FILE"
echo "COMMIT_HASH='$COMMIT_HASH'" >> "$LOCK_FILE"
echo "DEPLOY_TIME='$DEPLOY_TIME'" >> "$LOCK_FILE"

# Begin deployment
echo "Starting new deployment with PID $$."

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Ensure the network exists
docker network inspect sfcm-net >/dev/null 2>&1 || docker network create sfcm-net

# Deploy FE and BE using docker-compose
docker compose -f docker-compose.yaml up -d --build

echo "Front-end and back-end services are now running."

# Deployment completed
echo "Deployment completed successfully."

# Remove lock file
rm -f "$LOCK_FILE"

# Remove the trap
trap - INT TERM EXIT
