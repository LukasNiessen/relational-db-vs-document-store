# Financial Transaction System

This is a complete example of a financial transaction system built with Spring Boot (backend) and React (frontend). It demonstrates the use of a relational database for maintaining financial data with strong consistency and reliability.

## Tech Stack

### Backend

- Java 17
- Spring Boot 2.7.x
- Spring Data JPA
- H2 Database (for simplicity, can be replaced with PostgreSQL or MySQL)
- Spring Web for RESTful APIs
- Gradle for build management

### Frontend

- React 18.x
- TypeScript
- Axios for API communication
- React Router
- Material-UI for styling

## Features

- Create and manage accounts
- Process transfers between accounts
- View transaction history
- Maintain accurate account balances with ACID compliance
- Simple dashboard with account overview

## Running the Application

### Backend

1. Navigate to the backend directory:

```
cd backend
```

2. Build and run the application using the provided Gradle wrapper:

For Windows:

```powershell
.\gradlew.bat bootRun
```

For Unix/Mac:

```bash
chmod +x ./gradlew
./gradlew bootRun
```

The backend will start on http://localhost:8080

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

The API documentation is available at http://localhost:8080/swagger-ui.html when the backend is running.

## Database

The application uses an embedded H2 database for simplicity. You can access the H2 console at http://localhost:8080/h2-console with the following credentials:

- JDBC URL: jdbc:h2:mem:financedb
- Username: sa
- Password: password

## Testing the Application

1. Create accounts using the UI or API
2. Make transfers between accounts
3. View transaction history
