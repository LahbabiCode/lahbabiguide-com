#!/bin/bash

# Configuration
# Usage: ./backup-db.sh [DATABASE_URL]
DB_URL=${1:-$DATABASE_URL}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="lahbabi_backup_${TIMESTAMP}.sql"

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL is not set and no argument was provided."
  exit 1
fi

mkdir -p $BACKUP_DIR

echo "Starting backup of LahbabiGuide database..."
pg_dump --no-owner --no-privileges $DB_URL > $BACKUP_DIR/$FILENAME

if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/$FILENAME"
else
  echo "Backup failed!"
  exit 1
fi
