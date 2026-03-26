FROM node:22-bookworm-slim

WORKDIR /app

# Install python runtime for AI bridge.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

# Install backend dependencies first (better caching).
COPY backend/package.json /app/backend/package.json
RUN cd /app/backend && npm install --omit=dev

# Install AI runtime + training dependencies.
COPY ai/requirements.txt /app/ai/requirements.txt
RUN pip3 install --no-cache-dir -r /app/ai/requirements.txt

# Copy full source.
COPY . /app

EXPOSE 4000
CMD ["/app/backend/scripts/start.sh"]
