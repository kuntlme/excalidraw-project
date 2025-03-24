# Draw Project

This project is a collaborative drawing application built using Next.js, TypeScript, and WebSockets. It allows multiple users to draw on a shared canvas in real-time.

![Draw Project Demo](/docs/images/demo.png)
*A preview of the collaborative drawing interface*

## Project Structure

The project is organized into several packages and applications:

- **apps/**: Contains the main applications of the project.
  - **excalidraw-frontend/**: The frontend application built with Next.js.
  - **http-backend/**: The HTTP backend server.
  - **web/**: Another frontend application built with Next.js.
  - **ws-backend/**: The WebSocket backend server.
- **packages/**: Contains shared packages used by the applications.
  - **backend-common/**: Common utilities for backend applications.
  - **common/**: Common utilities for both frontend and backend applications.
  - **db/**: Database-related code and Prisma schema.
  - **eslint-config/**: Shared ESLint configuration.
  - **typescript-config/**: Shared TypeScript configuration.
  - **ui/**: Shared UI components.

## Getting Started

### Prerequisites

- Node.js
- pnpm (preferred package manager)

### Installation

1. Clone the repository:

```bash
$ git clone https://github.com/Kuntalmajee2557/excalidraw-project.git
$ cd draw-project
```

2. Install dependencies:

```bash
$ pnpm install
```

### Running the Applications

#### Frontend (excalidraw-frontend)

1. Navigate to the frontend directory:

```bash
$ cd apps/excalidraw-frontend
```

2. Run the development server:

```bash
$ pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### HTTP Backend

1. Navigate to the HTTP backend directory:

```bash
$ cd apps/http-backend
```

2. Start the server:

```bash
$ pnpm start
```

#### WebSocket Backend

1. Navigate to the WebSocket backend directory:

```bash
$ cd apps/ws-backend
```

2. Start the server:

```bash
$ pnpm start
```

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript.
- [Prisma Documentation](https://www.prisma.io/docs/) - learn about Prisma.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
