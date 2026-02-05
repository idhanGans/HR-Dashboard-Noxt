# Use the official lightweight Node.js 23 image.
FROM node:23-slim

# Install prisma dependencies
RUN apt-get update -y && apt-get install -y openssl

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./

# Copy local code to the container image.
COPY src/ ./src/

# Copy prisma setup to the container image.
COPY prisma ./prisma/

# Install dependencies.
RUN npm install

# Transpile TypeScript to JavaScript.
RUN npm run build

# Generate prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Set the environment to staging
ENV NODE_ENV=staging

# Run the web service on container startup.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
