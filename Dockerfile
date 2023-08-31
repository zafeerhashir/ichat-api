# Use the official Node.js image as the base
FROM node:14


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Set the environment variable
ENV DB=$DB

# Expose the port that the app will listen on
EXPOSE 3001

# Start the app
CMD ["npx" ,"pm2-runtime", "start", "ecosystem.config.cjs" ]
