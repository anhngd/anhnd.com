#!/bin/bash
# ─────────────────────────────────────────────────────────
# status-agent.sh — Lightweight server metrics collector
# Runs via cron, writes JSON to a local file.
#
# Setup:
#   1. Copy to server: scp status-agent.sh user@server:~/
#   2. Make executable: chmod +x status-agent.sh
#   3. Edit config below (SERVER_NAME, OUTPUT_PATH)
#   4. Add to cron:
#      crontab -e
#      * * * * * /home/user/status-agent.sh
#   5. Serve OUTPUT_PATH via nginx (see nginx config below)
#
# Dependencies: bash, awk, grep, uptime, free, df, ping
# No external packages required.
# ─────────────────────────────────────────────────────────

# ── Config ───────────────────────────────────────────────
SERVER_NAME="Production"
SERVER_HOST="$(hostname -f 2>/dev/null || hostname)"
SERVER_LOCATION="Singapore"
OUTPUT_PATH="/var/www/status/status.json"
PING_TARGET="1.1.1.1"

# ── Collect metrics ──────────────────────────────────────

# Uptime
UPTIME_SEC=$(awk '{print int($1)}' /proc/uptime)
UPTIME_DAYS=$((UPTIME_SEC / 86400))
UPTIME_HOURS=$(( (UPTIME_SEC % 86400) / 3600 ))
UPTIME_MINS=$(( (UPTIME_SEC % 3600) / 60 ))
UPTIME_STR="${UPTIME_DAYS}d ${UPTIME_HOURS}h $(printf '%02d' $UPTIME_MINS)m"

# CPU
CPU_CORES=$(nproc 2>/dev/null || grep -c ^processor /proc/cpuinfo)
# Sample CPU usage over 1 second
CPU_USAGE=$(awk -v prev="$(cat /proc/stat | head -1)" '
  BEGIN { split(prev, a) }
  NR==1 {
    system("sleep 1")
  }' /dev/null; \
  awk 'NR==1{
    split($0, a);
    idle_prev=a[5]; total_prev=0;
    for(i=2;i<=NF;i++) total_prev+=a[i]
  }
  NR==2{
    split($0, b);
    idle_now=b[5]; total_now=0;
    for(i=2;i<=NF;i++) total_now+=b[i]
    diff_idle = idle_now - idle_prev
    diff_total = total_now - total_prev
    printf "%.0f", (1 - diff_idle/diff_total) * 100
  }' <(head -1 /proc/stat; sleep 1; head -1 /proc/stat) 2>/dev/null || echo "0")

# RAM
RAM_INFO=$(free -m | awk 'NR==2{printf "%d %d %.0f", $2, $3, $3/$2*100}')
RAM_TOTAL=$(echo "$RAM_INFO" | awk '{print $1}')
RAM_USED=$(echo "$RAM_INFO" | awk '{print $2}')
RAM_USAGE=$(echo "$RAM_INFO" | awk '{print $3}')

# Disk (root partition)
DISK_INFO=$(df -BG / | awk 'NR==2{gsub("G",""); printf "%d %d %.0f", $2, $3, $3/$2*100}')
DISK_TOTAL=$(echo "$DISK_INFO" | awk '{print $1}')
DISK_USED=$(echo "$DISK_INFO" | awk '{print $2}')
DISK_USAGE=$(echo "$DISK_INFO" | awk '{print $3}')

# Network speed (estimate from /proc/net/dev, 1 second sample)
NET_IFACE=$(ip route get 8.8.8.8 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="dev") print $(i+1)}' | head -1)
if [ -z "$NET_IFACE" ]; then
  NET_IFACE=$(ls /sys/class/net/ | grep -v lo | head -1)
fi

if [ -n "$NET_IFACE" ]; then
  RX1=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes 2>/dev/null || echo 0)
  TX1=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes 2>/dev/null || echo 0)
  sleep 1
  RX2=$(cat /sys/class/net/$NET_IFACE/statistics/rx_bytes 2>/dev/null || echo 0)
  TX2=$(cat /sys/class/net/$NET_IFACE/statistics/tx_bytes 2>/dev/null || echo 0)
  DOWN_MBPS=$(awk "BEGIN{printf \"%.1f\", ($RX2-$RX1)*8/1000000}")
  UP_MBPS=$(awk "BEGIN{printf \"%.1f\", ($TX2-$TX1)*8/1000000}")
else
  DOWN_MBPS="0.0"
  UP_MBPS="0.0"
fi

# Ping
PING_MS=$(ping -c 1 -W 2 "$PING_TARGET" 2>/dev/null | awk -F'/' 'END{print $5}')
[ -z "$PING_MS" ] && PING_MS="0.0"

# Determine status
if [ "$CPU_USAGE" -ge 95 ] || [ "$RAM_USAGE" -ge 95 ] || [ "$DISK_USAGE" -ge 95 ]; then
  STATUS="degraded"
else
  STATUS="online"
fi

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ── Write JSON ───────────────────────────────────────────
mkdir -p "$(dirname "$OUTPUT_PATH")"

cat > "$OUTPUT_PATH.tmp" <<ENDJSON
{
  "name": "${SERVER_NAME}",
  "host": "${SERVER_HOST}",
  "location": "${SERVER_LOCATION}",
  "status": "${STATUS}",
  "updated_at": "${NOW}",
  "uptime": "${UPTIME_STR}",
  "cpu": { "cores": ${CPU_CORES}, "usage": ${CPU_USAGE} },
  "ram": { "total_mb": ${RAM_TOTAL}, "used_mb": ${RAM_USED}, "usage": ${RAM_USAGE} },
  "disk": { "total_gb": ${DISK_TOTAL}, "used_gb": ${DISK_USED}, "usage": ${DISK_USAGE} },
  "network": {
    "upload_mbps": ${UP_MBPS},
    "download_mbps": ${DOWN_MBPS},
    "ping_ms": ${PING_MS}
  }
}
ENDJSON

# Atomic write
mv "$OUTPUT_PATH.tmp" "$OUTPUT_PATH"
