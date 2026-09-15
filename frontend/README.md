# BrightStart Frontend

BrightStart is a React frontend prototype for an English tutoring service aimed at Grade 1 to Grade 3 learners. The current frontend shows the main user journey: viewing available tutoring programs, booking a session, checking a learner progress screen, and viewing contact/about information.

This README explains how to run the frontend only.

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- The project downloaded or cloned from GitHub

To check if Node.js and npm are installed, run:

```bash
node -v
npm -v
```

If both commands show version numbers, you are ready to continue.

## How To Run The Frontend

1. Open a terminal in the main project folder.

2. Go into the frontend folder:

```bash
cd frontend
```

3. Install the frontend dependencies:

```bash
npm install
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open the local URL shown in the terminal.

It will usually be:

```bash
http://localhost:5173
```

The frontend calls the backend at `http://localhost:8080` by default. For a deployed backend,
create a `.env` file in this folder with:

```bash
VITE_API_URL=https://your-backend-url
```

If port `5173` is already being used, Vite may show a different port. Use the exact link shown in the terminal.

## Useful Commands

Run the frontend while developing:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Frontend Description For Presentation

The BrightStart frontend is a responsive React application designed for a children-focused English tutoring service. It presents a clean and simple interface where users can explore tutoring programs, request a session booking, view learner progress, and access contact details. The design is mobile-first, with a phone-style layout and navigation that supports the main screens needed for the tutoring service.

## Current Frontend Features

- Home screen with BrightStart branding and main call-to-action buttons
- Programs screen showing the available English tutoring options
- Booking screen with grade, session type, date, time, and number of learners
- Progress screen showing learner progress, skill percentages, and tutor comments
- About/contact screen with phone, WhatsApp, location, and email details
- Responsive layout for desktop and mobile screens

## Notes

- This README is for running the frontend only.
- The frontend is inside the `frontend` folder.
- The main React file is `src/main.jsx`.
