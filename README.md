# DTU Research Portal

> **Warning: This project is abandoned and no longer maintained.**

A full-stack web application for managing research paper submissions at DTU (Delhi Technological University). This portal allows users to submit research papers, track their status, and enables committee members and deans to review and approve submissions.

## Features

- User authentication with OTP
- Research paper submission with file upload
- Role-based access (Student, Committee, Dean)
- Dashboard for tracking submissions
- Email notifications
- Approval workflow

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (assumed from models)
- **Authentication**: JWT and OTP

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ayushkiller/dtu-research-portal.git
   cd dtu-research-portal
   ```

2. Install dependencies for the root project:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory with necessary configurations (e.g., database URL, email service credentials).

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The build artifacts will be stored in the `build/` directory.

## Project Structure

- `backend/`: Node.js server with Express.js
- `src/`: React frontend application
- `public/`: Static assets

## Contributing

This project is no longer accepting contributions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
