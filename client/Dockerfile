# Étape 1 : Build de l'application
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de configuration et dépendances
COPY package*.json ./
COPY next.config.ts ./
RUN npm ci

# Copie du reste du projet et build
COPY . .
RUN npm run build

# Étape 2 : Image légère pour la production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production

# Copie uniquement les fichiers nécessaires
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000
CMD ["npm", "start"]
