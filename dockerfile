# Use official Node.js image
FROM node:25

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose port (so Docker knows what your app uses)
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
