# Kitameraki Task Management App

## Prerequisites

Ensure you have the following installed:

- Node.js (v20 or higher)
- npm, yarn, or pnpm 

## Installation

### Frontend

Navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
pnpm install
# or if you prefer yarn
yarn install
# or if you prefer yarn
npm install
```

### Backend

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
pnpm install
# or if you prefer yarn
yarn install
# or if you prefer yarn
npm install
```

## Running the app

### Frontend

Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
pnpm run dev
# or if you prefer yarn
yarn run dev
# or if you prefer yarn
npm run dev
```

This will start the React development server, and you can view the application by opening your browser and navigating to `http://localhost:5173`.


### Backend

Navigate to the `backend` directory and start the development server:

```bash
cd backend
pnpm run start:dev
# or if you prefer yarn
yarn run start:dev
# or if you prefer yarn
npm run start:dev
```

This will start the NestJS development server, typically available at `http://localhost:3000`.


## Environment Variables


Both applications might require environment variables to be set. Create a .env file in the frontend and backend directories with the required variables.


### Frontend

```bash
VITE_BACKEND_URL=http://localhost:3000
```

### Backend

```bash
MONGODB_URL=
MONGODB_NAME=

JWT_SECRET=supersecret
JWT_EXPIRES_IN_HOUR=1
```

## API Documentation

You can navigate to `http://localhost:3000/api-doc` to see openapi swagger documentation after you run backend server

or

You can use openapi json file at directory `backend/docs` and import it to swagger hub or tools that can read openapi json file.