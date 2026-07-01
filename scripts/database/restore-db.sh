#!/bin/bash

# Configuration
# Usage: ./restore-db.sh [BACKUP_FILE] [DATABASE_URL]
BACKUP_FILE=$1
DB_URL=${2:-$DATABASE_URL}

if [ -z "$BACKUP_FILE" ]; then
  echo "Error: No backup file specified."
  echo "Usage: ./restore-db.sh [BACKUP_FILE] [DATABASE_URL]"
  exit 1
fi

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL is not set and no argument was provided."
  exit 1
fi

echo "Warning: This will overwrite the target database. Continue? (y/n)"
read confirm
if [ "$confirm" != "y" ]; then
  echo "Aborting."
  exit 0
fi

echo "Restoring database from $BACKUP_FILE..."
psql $DB_URL < $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "Restore successful!"
else
  echo "Restore failed!"
  exit 1
fi
