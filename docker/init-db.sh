#!/bin/bash
set -e

# This script runs automatically when the PostgreSQL container starts for the first time
# Add any additional initialization here (e.g., extensions, additional databases)

echo "✅ Database '$POSTGRES_DB' created successfully!"

# Uncomment to create additional databases:
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
#     CREATE DATABASE trackio_test;
# EOSQL
