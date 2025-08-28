import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Note, getDatabase } from './db';

// Note Service - provides functions to interact with the notes table
export const NoteService = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    const db = getDatabase();
    if (!db) return [];

    try {
      const result = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updated_at DESC');
      return result;
    } catch (error) {
      console.error('Error getting all notes:', error);
      return [];
    }
  },

  // Get a note by ID
  getNoteById: async (id: string): Promise<Note | null> => {
    const db = getDatabase();
    if (!db) return null;

    try {
      const result = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', [id]);
      return result || null;
    } catch (error) {
      console.error(`Error getting note ${id}:`, error);
      return null;
    }
  },

  // Create a new note
  createNote: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const db = getDatabase();
    if (!db) return '';

    const now = Date.now();
    const id = uuidv4();

    try {
      await db.runAsync(
        'INSERT INTO notes (id, title, content, created_at, updated_at, is_favorite, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, note.title, note.content, now, now, note.is_favorite || 0, note.color]
      );
      return id;
    } catch (error) {
      console.error('Error creating note:', error);
      return '';
    }
  },

  // Update an existing note
  updateNote: async (id: string, updates: Partial<Omit<Note, 'id' | 'created_at'>>): Promise<boolean> => {
    const db = getDatabase();
    if (!db) return false;

    try {
      const note = await NoteService.getNoteById(id);
      if (!note) return false;

      const now = Date.now();
      const updatedNote = {
        ...note,
        ...updates,
        updated_at: now,
      };

      await db.runAsync(
        'UPDATE notes SET title = ?, content = ?, updated_at = ?, is_favorite = ?, color = ? WHERE id = ?',
        [updatedNote.title, updatedNote.content, updatedNote.updated_at, updatedNote.is_favorite, updatedNote.color, id]
      );
      return true;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      return false;
    }
  },

  // Delete a note
  deleteNote: async (id: string): Promise<boolean> => {
    const db = getDatabase();
    if (!db) return false;

    try {
      await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (id: string): Promise<boolean> => {
    const db = getDatabase();
    if (!db) return false;

    try {
      const note = await NoteService.getNoteById(id);
      if (!note) return false;

      const newStatus = note.is_favorite === 1 ? 0 : 1;
      return await NoteService.updateNote(id, { is_favorite: newStatus });
    } catch (error) {
      console.error(`Error toggling favorite for note ${id}:`, error);
      return false;
    }
  },

  // Get favorite notes
  getFavoriteNotes: async (): Promise<Note[]> => {
    const db = getDatabase();
    if (!db) return [];

    try {
      const result = await db.getAllAsync<Note>('SELECT * FROM notes WHERE is_favorite = 1 ORDER BY updated_at DESC');
      return result;
    } catch (error) {
      console.error('Error getting favorite notes:', error);
      return [];
    }
  },

  // Search notes by title or content
  searchNotes: async (query: string): Promise<Note[]> => {
    const db = getDatabase();
    if (!db) return [];

    try {
      // Special handling for favorite search
      if (query.toLowerCase() === 'favorite:true') {
        return await NoteService.getFavoriteNotes();
      }
      
      const searchParam = `%${query}%`;
      const result = await db.getAllAsync<Note>(
        'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
        [searchParam, searchParam]
      );
      return result;
    } catch (error) {
      console.error(`Error searching notes for "${query}":`, error);
      return [];
    }
  }
};
