#!/bin/bash

LOCK_FILE="/tmp/deploy.lock"
PREV_COMMIT_FILE="/root/capstone-new/previous_commit.txt"

# Function to send Discord embed notification
send_discord_embed() {
  local title="$1"
  local color="$2"
  local repo="$3"
  local commit="$4"
  local time="$5"
  local additional_field="$6"
  local actor="$7"
  local actor_avatar_url="$8"
  local timestamp

  # Generate the timestamp in the required format
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  
  # Construct the JSON payload using jq with all variables properly passed
  local payload
  payload=$(jq -n \
    --arg title "$title" \
    --arg color "$color" \
    --arg repo "$repo" \
    --arg commit "$commit" \
    --arg time "$time" \
    --arg additional "$additional_field" \
    --arg actor "$actor" \
    --arg actor_avatar_url "$actor_avatar_url" \
    --arg timestamp "$timestamp" \
    '{
      embeds: [{
        author: { name: $actor, icon_url: $actor_avatar_url },
        title: $title,
        color: ($color | tonumber),
        fields: [
          { name: "Repository", value: $repo, inline: false },
          { name: "Commit", value: "[\($commit)](https://github.com/\($repo)/commit/\($commit))", inline: false },
          { name: "Time", value: "`\($time)`", inline: false },
          { name: "Additional Info", value: $additional, inline: false }
        ],
        timestamp: $timestamp,
        footer: { text: "Deployment System" }
      }]
    }')

  # Optionally, echo the payload for debugging
  echo "$payload"

  # Send the payload to Discord
  curl -H "Content-Type: application/json" -X POST -d "$payload" "$DISCORD_WEBHOOK_URL"
}

# Function to perform rollback
rollback() {
  # Check if PREV_COMMIT_HASH is set, if not, read from file
  if [ -z "$PREV_COMMIT_HASH" ]; then
    if [ -f "$PREV_COMMIT_FILE" ]; then
      PREV_COMMIT_HASH=$(cat "$PREV_COMMIT_FILE")
    else
      echo "Previous commit hash not found. Cannot perform rollback."
      exit 1
    fi
  fi
  
  echo "Initiating rollback to commit $PREV_COMMIT_HASH."
  
  # Checkout the previous commit
  git checkout $PREV_COMMIT_HASH
  git pull
  
  # Rebuild and redeploy previous version
  docker compose -f docker-compose.yaml up -d --build
  
  # Notify Discord about rollback
  send_discord_embed \
    "🔄 Rollback Initiated" \
    "15105570" \
    "$REPO_NAME" \
    "$PREV_COMMIT_HASH" \
    "$DEPLOY_TIME" \
    "Deployment failed. Rolled back to the previous stable version." \
    "$ACTOR" \
    "$ACTOR_AVATAR_URL"
}

# Set trap to handle script termination
cleanup() {
  echo "Deployment script terminated. Cleaning up."
  rm -f "$LOCK_FILE"
  exit 1
}

trap 'cleanup' INT TERM EXIT

# Before starting deployment, read the previous commit hash
if [ -f "$PREV_COMMIT_FILE" ]; then
  PREV_COMMIT_HASH=$(cat "$PREV_COMMIT_FILE")
else
  PREV_COMMIT_HASH="$COMMIT_HASH" # If no previous, set current
fi

# Check if lock file exists
if [ -f "$LOCK_FILE" ]; then
  cat "$LOCK_FILE" 
  OLD_DEPLOYMENT_PID=$(grep '^DEPLOYMENT_PID=' $LOCK_FILE | cut -d '=' -f2)
  OLD_REPO_NAME=$(grep '^REPO_NAME=' $LOCK_FILE | cut -d '=' -f2)
  OLD_COMMIT_HASH=$(grep '^COMMIT_HASH=' $LOCK_FILE | cut -d '=' -f2)
  OLD_DEPLOY_TIME=$(grep '^DEPLOY_TIME=' $LOCK_FILE | cut -d '=' -f2)
  OLD_ACTOR=$(grep '^ACTOR=' $LOCK_FILE | cut -d '=' -f2)
  OLD_ACTOR_AVATAR_URL=$(grep '^ACTOR_AVATAR_URL=' $LOCK_FILE | cut -d '=' -f2)

  echo "Deployment in progress with PID $OLD_DEPLOYMENT_PID. Terminating it."

  # Terminate the existing deployment process
  sudo kill -TERM "$OLD_DEPLOYMENT_PID"

  # Wait for the process to exit
  while kill -0 "$OLD_DEPLOYMENT_PID" 2>/dev/null; do
    echo "Waiting for process $OLD_DEPLOYMENT_PID to terminate..."
    sleep 1
  done

  # Send cancellation notification
  send_discord_embed \
    "⚠️ Deployment Cancelled" \
    "15105570" \
    "$OLD_REPO_NAME" \
    "$OLD_COMMIT_HASH" \
    "$OLD_DEPLOY_TIME" \
    "A new deployment has been initiated." \
    "$OLD_ACTOR" \
    "$OLD_ACTOR_AVATAR_URL"

  # Remove the lock file
  rm -f "$LOCK_FILE"
fi

# Begin deployment
echo "Starting new deployment with PID $$."

send_discord_embed \
  "🚀 Deployment Started" \
  "3447003" \
  "$REPO_NAME" \
  "$COMMIT_HASH" \
  "$DEPLOY_TIME" \
  "Deployment has been initiated." \
  "$ACTOR" \
  "$ACTOR_AVATAR_URL"

# Write current PID to lock file
echo "DEPLOYMENT_PID=$$" > "$LOCK_FILE"
# Write environment variables to lock file
echo "REPO_NAME=$REPO_NAME" >> "$LOCK_FILE"
echo "COMMIT_HASH=$COMMIT_HASH" >> "$LOCK_FILE"
echo "DEPLOY_TIME=$DEPLOY_TIME" >> "$LOCK_FILE"
echo "ACTOR=$ACTOR" >> "$LOCK_FILE"
echo "ACTOR_AVATAR_URL=$ACTOR_AVATAR_URL" >> "$LOCK_FILE"

# Set working directory to the location of the docker-compose file
cd /root/capstone-new/SFCM_FE

# Ensure the network exists
docker network inspect sfcm-net >/dev/null 2>&1 || docker network create sfcm-net

# Deploy FE and BE using docker-compose
docker compose -f docker-compose.yaml up -d --build

# Check if 3 containers: sfcm-db, sfcm-be, sfcm-fe are running
if [ $(docker ps -q -f name=sfcm-db | wc -l) -ne 1 ] || [ $(docker ps -q -f name=sfcm-be | wc -l) -ne 1 ] || [ $(docker ps -q -f name=sfcm-fe | wc -l) -ne 1 ]; then
  echo "Error: One or more containers failed to start."
  local missing_containers
  missing_containers=$(docker ps --filter "status=exited" --format "{{.Names}}")
  echo "Missing containers: $missing_containers"
  send_discord_embed \
    "❌ Deployment Failed" \
    "15158332" \
    "$REPO_NAME" \
    "$COMMIT_HASH" \
    "$DEPLOY_TIME" \
    "Containers failed to start: $missing_containers" \
    "$ACTOR" \
    "$ACTOR_AVATAR_URL"
  exit 1
fi

echo "Front-end and back-end services are now running."

# Deployment completed
echo "Deployment completed successfully."
echo "$COMMIT_HASH" > "$PREV_COMMIT_FILE"

send_discord_embed \
  "✅ Deployment Successful" \
  "3066993" \
  "$REPO_NAME" \
  "$COMMIT_HASH" \
  "$DEPLOY_TIME" \
  "The deployment was successful." \
  "$ACTOR" \
  "$ACTOR_AVATAR_URL"

# Remove lock file and cleanup
rm -f "$LOCK_FILE"
trap - INT TERM EXIT
