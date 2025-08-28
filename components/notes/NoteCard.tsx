import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNotes } from '@/context/NotesContext';
import { Note } from '@/database/db';
import { useThemeColor } from '@/hooks/useThemeColor';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const { toggleFavorite } = useNotes();
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#222' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const borderColor = useThemeColor({ light: '#eee', dark: '#333' }, 'background');
  const cardColor = note.color || backgroundColor;
  
  // Format the date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Extract a preview of the content (limit to 100 characters)
  const contentPreview = note.content 
    ? note.content.length > 100 
      ? `${note.content.substring(0, 100)}...` 
      : note.content 
    : '';

  const handlePress = () => {
    // Navigate to note detail screen
    router.push({
      pathname: "/(note)/[id]" as any,
      params: { id: note.id }
    });
  };

  const handleFavoriteToggle = async (e: any) => {
    e.stopPropagation();
    await toggleFavorite(note.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <ThemedView 
        style={[
          styles.card, 
          { 
            backgroundColor: cardColor,
            borderColor: note.color ? cardColor : borderColor
          }
        ]}
      >
        <View style={styles.header}>
          <ThemedText 
            numberOfLines={1} 
            type="subtitle" 
            style={[styles.title, { color: textColor }]}
          >
            {note.title}
          </ThemedText>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
            <Feather 
              name="star"
              size={18} 
              color={note.is_favorite === 1 ? "#FFD700" : "#999"} 
            />
          </TouchableOpacity>
        </View>
        
        <ThemedText 
          numberOfLines={3} 
          style={[styles.content, { color: textColor }]}
        >
          {contentPreview}
        </ThemedText>
        
        <ThemedText style={styles.date}>
          {formatDate(note.updated_at)}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  }
});
