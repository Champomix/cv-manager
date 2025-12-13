# Utilisation d'une image Node.js légère
FROM node:20-alpine 

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration et installation des dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copie du reste de l'application
COPY . .
RUN mkdir -p uploads && \
    chown node:node uploads && \
    chmod 755 uploads

# Exposition du port
EXPOSE 5001

# Lancement de l'application
CMD ["node", "index-datafile.js"]
