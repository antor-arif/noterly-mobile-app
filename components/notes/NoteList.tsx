import { ThemedText } from '@/components/ThemedText';
import { Note } from '@/database/db';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { NoteCard } from './NoteCard';

interface NoteListProps {
  notes: Note[];
  loading: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

export function NoteList({ 
  notes, 
  loading, 
  onRefresh, 
  refreshing = false,
  emptyMessage = 'No notes found'
}: NoteListProps) {
  const backgroundColor = useThemeColor({ light: '#f8f8f8', dark: '#111' }, 'background');

  if (loading && notes.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NoteCard note={item} />}
      contentContainerStyle={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    minHeight: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
