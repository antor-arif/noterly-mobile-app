import { Note, initDatabase } from '@/database/db';
import { NoteService } from '@/database/noteService';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note | null>;
  createNote: (note: { title: string; content: string | null; color?: string | null }) => Promise<string>;
  updateNote: (id: string, updates: Partial<{ title: string; content: string | null; color: string | null }>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
  searchNotes: (query: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database on component mount
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        initDatabase();
        await refreshNotes();
      } catch (err) {
        setError('Failed to initialize database');
        console.error('Database initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const refreshNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await NoteService.getAllNotes();
      setNotes(fetchedNotes);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNoteById = async (id: string) => {
    return await NoteService.getNoteById(id);
  };

  const createNote = async (note: { title: string; content: string | null; color?: string | null }) => {
    const id = await NoteService.createNote({
      title: note.title,
      content: note.content,
      is_favorite: 0,
      color: note.color || null
    });
    
    if (id) {
      await refreshNotes();
    }
    
    return id;
  };

  const updateNote = async (id: string, updates: Partial<{ title: string; content: string | null; color: string | null }>) => {
    const success = await NoteService.updateNote(id, updates);
    
    if (success) {
      await refreshNotes();
    }
    
    return success;
  };

  const deleteNote = async (id: string) => {
    const success = await NoteService.deleteNote(id);
    
    if (success) {
      await refreshNotes();
    }
    
    return success;
  };

  const toggleFavorite = async (id: string) => {
    const success = await NoteService.toggleFavorite(id);
    
    if (success) {
      await refreshNotes();
    }
    
    return success;
  };

  const searchNotes = async (query: string) => {
    try {
      setLoading(true);
      const results = await NoteService.searchNotes(query);
      setNotes(results);
    } catch (err) {
      setError('Failed to search notes');
      console.error('Error searching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notes,
    loading,
    error,
    refreshNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    searchNotes
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
