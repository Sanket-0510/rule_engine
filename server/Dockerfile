# Use the official Node.js image as the base image
FROM node:14

# Install PostgreSQL and other dependencies
RUN apt-get update && apt-get install -y postgresql postgresql-contrib

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install Sequelize CLI globally if not already done
RUN npm install -g sequelize-cli

# Switch to the postgres user for database setup
USER postgres

# Initialize PostgreSQL and create user/database directly as postgres user
RUN service postgresql start && \
    psql -c "CREATE DATABASE zeotap_db;" && \
    psql -c "ALTER USER postgres WITH PASSWORD 'zeotap';" && \
    psql -c "GRANT ALL PRIVILEGES ON DATABASE zeotap_db TO postgres;"

# Switch back to root user to run Sequelize migrations
USER root

# Run migrations using Sequelize
RUN service postgresql start && \
    npx sequelize-cli db:migrate

# Expose the port the app runs on
EXPOSE 8000

# Run both PostgreSQL and the Node.js app
CMD service postgresql start && npm start
