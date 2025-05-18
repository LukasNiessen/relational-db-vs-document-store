# Content Management System

This is a complete example of a content management system built with Spring Boot (backend) and React (frontend). It demonstrates the use of a document-oriented database (MongoDB) for flexibility in content types and schema evolution.

## Tech Stack

### Backend

- Java 17
- Spring Boot 2.7.x
- Spring Data MongoDB
- MongoDB for document storage
- Spring Web for RESTful APIs

### Frontend

- React 18.x
- TypeScript
- Axios for API communication
- React Router
- Material-UI for styling

## Features

- Create and manage different types of content (articles, products, etc.)
- Add comments to content
- Search and filter content by type, tags, or other attributes
- Flexible data model without migration needs
- Rich text editor for content creation

## Running the Application

### Backend

1. Set up MongoDB:
   Make sure you have MongoDB running locally on the default port (27017).

   **Option 1: Using Docker** (recommended for quick setup):

   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

   **Option 2: Install MongoDB locally:**

   - Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community
   - For Windows: Run MongoDB as a service or start it manually
   - For Mac: Use Homebrew with `brew install mongodb-community`
   - For Linux: Follow distribution-specific instructions

   **MongoDB Configuration:**
   The application is configured to connect to MongoDB with these settings:

   - Host: localhost
   - Port: 27017
   - Database: cmsdb

   If you need to use different MongoDB settings, update them in `backend/src/main/resources/application.properties`

   **Checking MongoDB connection:**
   You can check if MongoDB is running with:

   For MongoDB CLI:

   ```powershell
   mongo
   ```

   With Docker:

   ```powershell
   docker exec -it mongodb mongo
   ```

2. Navigate to the backend directory:

   ```
   cd backend
   ```

3. Build and run the application using the provided Gradle wrapper:

   For Windows:

   ```powershell
   .\gradlew.bat bootRun
   ```

   For Unix/Mac:

   ```bash
   chmod +x ./gradlew
   ./gradlew bootRun
   ```

The backend will start on http://localhost:8081

#### Other Useful Gradle Commands

These commands can be run using the Gradle wrapper (`gradlew.bat` on Windows or `./gradlew` on Unix/Mac):

- Clean and build: `clean build`
- Run tests: `test`
- Generate JAR file: `bootJar`

### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will be accessible at http://localhost:3000

## API Documentation

The API documentation is available at http://localhost:8081/swagger-ui.html when the backend is running.

## MongoDB Database

The application uses MongoDB for data storage. You can connect to the database using MongoDB Compass or the mongo shell:

- Connection string: mongodb://localhost:27017/cmsdb

## Testing the Application

1. Create different types of content (articles, products)
2. Add comments to content items
3. Search and filter content by type, tags, etc.
