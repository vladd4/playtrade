## Overview
This is a **Telegram Mini App** designed as a marketplace where users can buy and sell video game items, accounts, currency, and other digital assets. The project is built using a **client-server monolithic architecture**, with the server implemented in **NestJS** (using TypeScript), the client built with **Next.js** (also using TypeScript), and communication handled using **REST API** and **WebSockets**. The application is containerized with **Docker** and orchestrated with **Docker Compose** for deployment.

## Technologies Used
- **Server:** NestJS + TypeScript
- **Client:** Next.js + TypeScript
- **WebSockets:** For real-time communication
- **Database:** PostgreSQL
- **Docker:** For containerization
- **Docker Compose:** For orchestration and deployment
- **Nginx:** For reverse proxy and load balancing

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Steps to Install Locally
1. Clone the repository:

   ```bash
    git clone https://github.com/vladd4/playtrade
    cd playtrade

2. Install server dependencies:

   ```bash
    cd server
    npm install

3. Install client dependencies:

   ```bash
    cd client
    npm install

4. Configure environment variables. Create .env files for client with the necessary configurations:

   ```bash
    NEXT_PUBLIC_BACKEND_API_URL=''
    NEXT_PUBLIC_AUTH_SECRET=''
    NEXT_PUBLIC_CLIENT_USERNAME=""
    NEXT_PUBLIC_CLIENT_PASSWORD=""
    
5. Configure environment variables. Create .env files for server with the necessary configurations:

   ```bash
    TELEGRAM_BOT_TOKEN=''
    JWT_SECRET=''
    JWT_USER=''
    JWT_PASSWORD=''
    DB_HOST=''
    DB_PORT=''
    DB_USERNAME=''
    DB_PASSWORD=''
    DB_NAME=''

6. Run the development environment:

   ```bash
    cd server
    npm run start:dev

    cd ../client
    npm run dev

### Docker Setup
1. Build Docker Images and run application:

   ```bash
    docker-compose up --build -d
