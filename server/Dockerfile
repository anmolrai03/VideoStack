FROM node:22.18.0-slim

# Install ffmpeg without unneeded recommended packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /server

# Copy package manifests for efficient Docker layer caching
COPY package*.json ./

# Deterministic production-only dependency install
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Ensure storage directories exist
RUN mkdir -p public/data/clientUploads public/data/processed

EXPOSE 3000

CMD [ "node", "server.js" ]
