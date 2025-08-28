import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNotes } from '@/context/NotesContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NoteEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, createNote, updateNote, deleteNote } = useNotes();
  
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'text');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Load note data if editing an existing note
  useEffect(() => {
    const loadNote = async () => {
      if (id) {
        const note = await getNoteById(id);
        if (note) {
          setTitle(note.title);
          setContent(note.content || '');
          setIsNew(false);
        }
      }
    };
    
    loadNote();
  }, [id, getNoteById]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    setIsSaving(true);
    
    try {
      if (isNew) {
        await createNote({
          title: title.trim(),
          content: content.trim() || null
        });
      } else if (id) {
        await updateNote(id, {
          title: title.trim(),
          content: content.trim() || null
        });
      }
      
      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  }, [isNew, id, title, content, createNote, updateNote, router]);

  const handleDelete = useCallback(() => {
    if (isNew) {
      router.back();
      return;
    }
    
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
  }, [isNew, id, deleteNote, router]);

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
            onPress={handleDelete} 
            style={[styles.headerButton, styles.deleteButton]}
            disabled={isSaving}
          >
            <Feather name="trash-2" size={22} color="#FF3B30" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.headerButton}
            disabled={isSaving}
          >
            <ThemedText>{isSaving ? 'Saving...' : 'Save'}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Note Content */}
      <ScrollView style={styles.content}>
        <TextInput
          style={[styles.titleInput, { color: textColor }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={placeholderColor}
          maxLength={100}
          selectionColor={textColor}
        />
        
        <TextInput
          style={[styles.contentInput, { color: textColor }]}
          value={content}
          onChangeText={setContent}
          placeholder="Start typing..."
          placeholderTextColor={placeholderColor}
          multiline
          textAlignVertical="top"
          selectionColor={textColor}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  deleteButton: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    padding: 0,
    marginBottom: 16,
  },
});
