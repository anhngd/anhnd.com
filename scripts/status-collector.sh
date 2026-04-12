#!/bin/bash
# ─────────────────────────────────────────────────────────
# status-collector.sh — Gathers status from all servers
# Runs via cron on ONE server, outputs combined JSON.
#
# Setup:
#   1. Edit SERVERS array below
#   2. Ensure SSH key access to each server
#   3. Add to cron:
#      * * * * * /home/user/status-collector.sh
#   4. Serve OUTPUT_PATH via nginx with CORS headers
#
# Nginx config for serving the combined JSON:
#
#   location /status/ {
#       root /var/www;
#       default_type application/json;
#       add_header Access-Control-Allow-Origin "*";
#       add_header Access-Control-Allow-Methods "GET";
#       add_header Cache-Control "no-cache, no-store";
#   }
#
# ─────────────────────────────────────────────────────────

# ── Config ───────────────────────────────────────────────

# Each entry: "user@host:/path/to/status.json"
# The agent (status-agent.sh) on each server writes this file
SERVERS=(
  "root@prod-01.anhnd.com:/var/www/status/status.json"
  "root@staging-01.anhnd.com:/var/www/status/status.json"
  "root@db-01.anhnd.com:/var/www/status/status.json"
)

OUTPUT_PATH="/var/www/status/servers.json"
SSH_OPTS="-o ConnectTimeout=5 -o StrictHostKeyChecking=no -o BatchMode=yes"

# ── Collect ──────────────────────────────────────────────

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TEMP_DIR=$(mktemp -d)
PIDS=()

# Fetch all in parallel
for i in "${!SERVERS[@]}"; do
  ENTRY="${SERVERS[$i]}"
  SSH_TARGET="${ENTRY%%:*}"
  REMOTE_PATH="${ENTRY#*:}"

  (
    DATA=$(ssh $SSH_OPTS "$SSH_TARGET" "cat $REMOTE_PATH" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$DATA" ]; then
      echo "$DATA" > "$TEMP_DIR/$i.json"
    else
      # Server unreachable — generate offline entry
      HOST=$(echo "$SSH_TARGET" | cut -d@ -f2)
      cat > "$TEMP_DIR/$i.json" <<EOF
{
  "name": "$HOST",
  "host": "$HOST",
  "location": "",
  "status": "offline",
  "updated_at": "$NOW",
  "uptime": "—",
  "cpu": { "cores": 0, "usage": 0 },
  "ram": { "total_mb": 0, "used_mb": 0, "usage": 0 },
  "disk": { "total_gb": 0, "used_gb": 0, "usage": 0 },
  "network": { "upload_mbps": 0, "download_mbps": 0, "ping_ms": 0 }
}
EOF
    fi
  ) &
  PIDS+=($!)
done

# Wait for all fetches
for PID in "${PIDS[@]}"; do
  wait "$PID"
done

# ── Combine into single JSON ────────────────────────────

mkdir -p "$(dirname "$OUTPUT_PATH")"

{
  echo '{'
  echo "  \"generated_at\": \"${NOW}\","
  echo '  "servers": ['

  FIRST=true
  for f in "$TEMP_DIR"/*.json; do
    [ -f "$f" ] || continue
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo '    ,'
    fi
    # Indent server JSON
    sed 's/^/    /' "$f"
  done

  echo '  ]'
  echo '}'
} > "$OUTPUT_PATH.tmp"

mv "$OUTPUT_PATH.tmp" "$OUTPUT_PATH"

# Cleanup
rm -rf "$TEMP_DIR"
