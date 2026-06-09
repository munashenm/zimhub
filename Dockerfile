# Railway Dockerfile — fresh Linux npm install (avoids Windows lockfile / Tailwind oxide bug)
FROM node:20-bookworm-slim

WORKDIR /app

# Prisma needs OpenSSL on slim images
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy prisma before npm install — postinstall runs `prisma generate` and needs schema.prisma
COPY package.json ./
COPY prisma ./prisma
RUN npm install --include=dev

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
