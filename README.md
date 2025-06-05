# TinyGo - URL Shortener Application

TinyGo is a modern URL shortener application designed to simplify sharing long URLs. It features a robust backend built with Spring Boot and a sleek frontend powered by a modern JavaScript framework. TinyGo provides a seamless experience for shortening URLs, tracking click events, and managing user accounts.

## Features

- **URL Shortening**: Generate short and shareable URLs.
- **Click Tracking**: Monitor click events and analytics for shortened URLs.
- **User Authentication**: Secure user registration and login.
- **Responsive Design**: Modern and responsive UI built with Tailwind CSS.
- **Scalable Backend**: Built with Spring Boot and MySQL for scalability.

## Folder Structure

The project is organized as follows:

```
TinyGo/
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/url/shortener/
│   │   │   │   ├── controller/
│   │   │   │   ├── dtos/
│   │   │   │   ├── models/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   ├── service/
│   │   │   │   └── UrlShortenerSbApplication.java
│   │   │   ├── resources/
│   │   │   │   ├── application.properties
│   │   │   │   └── static/
│   │   │   └── webapp/
│   ├── target/
│   ├── Dockerfile
│   └── pom.xml
|
|
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── main.js
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

- **Backend**: Contains the Spring Boot application code, including controllers, services, models, and repositories.
  - **Dockerfile**: Used to build the Docker image for the backend application.
- **Frontend**: Contains the JavaScript framework-based UI code, including components, pages, and assets.
- **README.md**: Documentation for the project.

## Installation Instructions

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/rahul2004a/TinyGo.git
   cd TinyGo/Backend
   ```

2. Configure the database:

   - Set up a MySQL database.
   - Update the `application.properties` file with your database credentials.

3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd TinyGo/Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Setup

You can also use the Docker image of the Spring Boot application hosted on Docker Hub for easier deployment.

### Pull the Docker Image

1. Pull the Docker image from Docker Hub:
   ```bash
   docker pull rahul1320/tinygo
   ```

### Run the Docker Container

2. Run the container:

   ```bash
   docker run -d -p 8080:8080 --name tinygo-backend rahul1320/tinygo
   ```

   - The backend will be accessible at `http://localhost:8080`.

### Environment Configuration

3. If you need to configure environment variables (e.g., database credentials), use the `-e` flag:
   ```bash
   docker run -d -p 8080:8080 --name tinygo-backend \
   -e SPRING_DATASOURCE_URL=jdbc:mysql://<db_host>:<db_port>/<db_name> \
   -e SPRING_DATASOURCE_USERNAME=<db_username> \
   -e SPRING_DATASOURCE_PASSWORD=<db_password> \
   rahul1320/tinygo
   ```

---

For more details on Docker usage, refer to the [Docker documentation](https://docs.docker.com/).

## Usage

1. Access the application via the frontend development server URL (e.g., `http://localhost:5173`).
2. Register or log in to your account.
3. Paste a long URL and generate a shortened version.
4. Share the shortened URL and track its click analytics.

## Technologies Used

### Backend

- **Spring Boot**: Framework for building the backend.
- **Maven**: Dependency management.
- **MySQL**: Relational database.
- **Lombok**: Simplifies Java code with annotations.
- **Spring Boot Starter Data JPA**: ORM for database interactions.
- **Spring Boot Starter Web**: RESTful web services.
- **Spring Boot Starter Test**: Testing utilities.

### Frontend

- **Modern JavaScript Framework**: For building the UI.
- **Tailwind CSS**: Utility-first CSS framework.
- **Vite**: Fast frontend tooling.

## Contribution Guidelines

We welcome contributions to TinyGo! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Submit a pull request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

---

Thank you for using TinyGo! If you encounter any issues or have suggestions, feel free to open an issue or contact us.
