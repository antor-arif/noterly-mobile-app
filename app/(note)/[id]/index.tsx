import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNotes } from '@/context/NotesContext';
import { Note } from '@/database/db';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, toggleFavorite, deleteNote } = useNotes();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  
  // Format the date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      if (id) {
        setLoading(true);
        const fetchedNote = await getNoteById(id);
        setNote(fetchedNote);
        setLoading(false);
      }
    };
    
    loadNote();
  }, [id, getNoteById]);

  const handleEdit = useCallback(() => {
    if (id) {
      router.push({
        pathname: "/(note)/edit" as any,
        params: { id }
      });
    }
  }, [id, router]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deleteNote(id);
              router.back();
            }
          }
        }
      ]
    );
  }, [id, deleteNote, router]);

  const handleToggleFavorite = useCallback(async () => {
    if (id) {
      await toggleFavorite(id);
      // Refresh the note data
      const updatedNote = await getNoteById(id);
      setNote(updatedNote);
    }
  }, [id, toggleFavorite, getNoteById]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!note) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>Note not found</ThemedText>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={textColor} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleToggleFavorite} 
            style={styles.headerButton}
          >
            <Feather 
              name="star" 
              size={22} 
              color={note.is_favorite === 1 ? "#FFD700" : "#999"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleDelete} 
            style={[styles.headerButton, { marginHorizontal: 16 }]}
          >
            <Feather name="trash-2" size={22} color="#FF3B30" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleEdit} 
            style={styles.headerButton}
          >
            <Feather name="edit-2" size={22} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Note Content */}
      <ScrollView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {note.title}
        </ThemedText>
        
        <ThemedText style={styles.date}>
          {formatDate(note.updated_at)}
        </ThemedText>
        
        <ThemedText style={styles.noteContent}>
          {note.content || 'No content'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
});
