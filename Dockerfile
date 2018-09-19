FROM node:6.14.2-alpine

# Set up our workspace
WORKDIR /usr/app

# Install app dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install --quiet

# App source
COPY . .

# Ports
EXPOSE 3000

# Default Command
CMD ["npm", "run", "start"]