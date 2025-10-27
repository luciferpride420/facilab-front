# Use the official n8n Docker image
FROM n8nio/n8n:latest

# Set environment variables
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=changeme123
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV WEBHOOK_URL=https://your-n8n-app.onrender.com

# Database configuration (will be set via environment variables)
ENV DB_TYPE=postgresdb
ENV DB_POSTGRESDB_HOST=your-supabase-host
ENV DB_POSTGRESDB_PORT=5432
ENV DB_POSTGRESDB_DATABASE=postgres
ENV DB_POSTGRESDB_USER=postgres
ENV DB_POSTGRESDB_PASSWORD=your-supabase-password
ENV DB_POSTGRESDB_SCHEMA=n8n

# Additional n8n settings
ENV N8N_LOG_LEVEL=info
ENV N8N_METRICS=true
ENV N8N_DIAGNOSTICS_ENABLED=false

# Expose port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]



