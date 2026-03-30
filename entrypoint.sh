#!/bin/sh
set -e

# Placeholder for Admin Backend URL
# This script finds the placeholder used during build and replaces it with the runtime environment variable
if [ -n "$MEDUSA_ADMIN_BACKEND_URL" ]; then
  echo "Injecting MEDUSA_ADMIN_BACKEND_URL: $MEDUSA_ADMIN_BACKEND_URL"
  # Replace placeholder in compiled admin assets
  # Medusa 2.0 admin assets are typically in .medusa/server/public/admin/
  find .medusa/server/public/admin -name "*.js" -exec sed -i "s|http://localhost:9000|$MEDUSA_ADMIN_BACKEND_URL|g" {} +
fi

# Run migrations if requested (optional, can be controlled via env var)
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running database migrations..."
  npx medusa db:migrate
fi

# Start the application
echo "Starting Medusa..."
exec npx medusa start
