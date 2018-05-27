FROM node:8.11-alpine

# Set up our workspace
WORKDIR /usr/app

# Install app dependencies
COPY package.json .
RUN npm install --quiet

# App source
COPY . .

# Ports
EXPOSE 3000
