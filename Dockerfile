# Railway Dockerfile — fresh Linux npm install (avoids Windows lockfile / Tailwind oxide bug)
FROM node:20-bookworm-slim

WORKDIR /app

# Install deps on Linux without a Windows-generated lockfile
COPY package.json ./
RUN npm install --include=dev

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

EXPOSE 3000
CMD ["npm", "start"]
