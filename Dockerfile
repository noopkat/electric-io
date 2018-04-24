FROM node:8.11-alpine

# Install app dependencies
COPY package.json .
RUN npm install

# App source
COPY . .

# Ports
EXPOSE 3000

# Commands (not for prodcution)
CMD ["npm", "run", "start"]