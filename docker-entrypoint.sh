#!/bin/sh

# Generate config.js from environment variables
cat > /app/public/config.js << EOF
// Runtime configuration
window.__API_BASE_URL = '${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}';
EOF

# Start the application
exec npm start
