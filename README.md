# Noterly - Mobile Note-Taking App

Noterly is a simple and efficient note-taking app built with React Native and Expo. It uses SQLite for local storage, eliminating the need for an external server.

## Features

- Create, read, update, and delete notes
- Local storage using SQLite
- Mark notes as favorites
- Search functionality
- Dark/light mode support
- Responsive UI

## Technology Stack

- React Native
- Expo Router for navigation
- SQLite for local database
- TypeScript
- React Context API for state management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/noterly-mobile-app.git
cd noterly-mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Use the Expo Go app to scan the QR code and open the app on your device.

## Project Structure

- `app/` - Contains all the screens and navigation setup (Expo Router)
- `components/` - Reusable UI components
- `context/` - React Context for state management
- `database/` - SQLite database configuration and services
- `hooks/` - Custom React hooks
- `constants/` - App constants like colors and themes

## Database Schema

The app uses a simple SQLite database with the following tables:

### Notes Table
- `id` (TEXT) - Primary key
- `title` (TEXT) - Note title
- `content` (TEXT) - Note content
- `created_at` (INTEGER) - Creation timestamp
- `updated_at` (INTEGER) - Last update timestamp
- `is_favorite` (INTEGER) - Whether the note is marked as favorite (0 or 1)
- `color` (TEXT) - Optional note color

Additional tables for future features like tags are also included in the schema.

## License

MIT
