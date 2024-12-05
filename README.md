# **NestJS User and Document Management API**

## **Introduction**

This project is a modular, scalable backend service built using **NestJS**. It manages **user authentication**, **user roles and permissions**, **document management**, and **ingestion processes**. It adheres to best practices, including **SOLID principles**, **modular architecture**, and **test-driven development**, ensuring maintainability and scalability.

The application is containerized with **Docker** and includes a reverse proxy configuration using **Nginx** for production deployment.

---

## **Features and Endpoints**

### **1. Authentication Module**
- **Description**: Manages user registration, login, logout, and profile retrieval.
- **Endpoints**:

| Method | Path              | Description                           |
|--------|-------------------|---------------------------------------|
| POST   | `/auth/register`  | Register a new user.                  |
| POST   | `/auth/login`     | Log in a user and return a JWT.       |
| POST   | `/auth/logout`    | Log out a user.                       |
| GET    | `/auth/profile`   | Get the authenticated user's profile. |

---

### **2. User Management Module**
- **Description**: Admin-only functionality for managing users and roles.
- **Endpoints**:

| Method | Path                 | Description                           |
|--------|----------------------|---------------------------------------|
| GET    | `/users`             | Get a list of all users. (Admin-only) |
| GET    | `/users/:id`         | Get details of a specific user.       |
| POST   | `/users`             | Add a new user.                       |
| PATCH  | `/users/:id/role`    | Update a user's role.                 |
| DELETE | `/users/:id`         | Delete a user.                        |

---

### **3. Document Management Module**
- **Description**: Provides CRUD operations for documents, including file upload.
- **Endpoints**:

| Method | Path                   | Description                           |
|--------|------------------------|---------------------------------------|
| GET    | `/documents`           | Get a list of all documents.          |
| GET    | `/documents/:id`       | Get details of a specific document.   |
| POST   | `/documents`           | Create a new document.                |
| PATCH  | `/documents/:id`       | Update an existing document.          |
| DELETE | `/documents/:id`       | Delete a document.                    |
| POST   | `/documents/upload`    | Upload a document file.               |

---

### **4. Ingestion Module**
- **Description**: Handles ingestion processes via a mocked Python backend.
- **Endpoints**:

| Method | Path                        | Description                           |
|--------|-----------------------------|---------------------------------------|
| POST   | `/ingestion/trigger`        | Trigger the ingestion process.        |
| GET    | `/ingestion`                | List all ingestion processes.         |
| GET    | `/ingestion/:id`            | Get the status of a specific process. |
| PATCH  | `/ingestion/:id/cancel`     | Cancel an ongoing ingestion process.  |

---

## **Setup and Installation**

### **Prerequisites**
- Node.js (v22)
- Docker and Docker Compose

### **Installation**
1. Local Installation and setup:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   docker-compose up -d

2. Deployment AWS:
      ```bash
      ssh -i <your-key.pem> ec2-user@<EC2-public-IP>
      sudo yum update -y
      sudo yum install docker -y
      sudo service docker start
      sudo usermod -aG docker $USER
      sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      sudo chmod +x /usr/local/bin/docker-compose
    
      git clone <repository-url>
      cd <repository-folder>
      docker-compose up -d
      http://<EC2-public-IP>:9001/
      
3. Testing:
    ```bash
    npm run test:e2e
