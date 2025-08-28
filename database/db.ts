import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Create or open the database
export function getDatabase() {
  if (Platform.OS === 'web') {
    console.warn('SQLite is not supported on web');
    return null;
  }

  return SQLite.openDatabaseSync('noterly.db');
}

// Database interfaces for TypeScript
export interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: number;
  updated_at: number;
  is_favorite: number;
  color: string | null;
}

// Initialize the database with tables
export function initDatabase() {
  const db = getDatabase();
  if (!db) return;
  
  // Create notes table
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_favorite INTEGER DEFAULT 0,
      color TEXT
    );
  `).catch(error => {
    console.error('Error creating notes table:', error);
  });

  // Create tags table (for future use)
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE
    );
  `).catch(error => {
    console.error('Error creating tags table:', error);
  });

  // Create note_tags junction table (for future use)
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (note_id, tag_id),
      FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    );
  `).catch(error => {
    console.error('Error creating note_tags table:', error);
  });

  return db;
}
