# Use the Node.js LTS image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the application port
EXPOSE 9001

# Start the application
CMD ["npm", "run", "start:dev"]
