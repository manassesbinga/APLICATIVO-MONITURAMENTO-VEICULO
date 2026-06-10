import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface RecentServersProps {
  servers: string[];
  onSelectServer: (url: string) => void;
  onRemoveServer: (url: string) => void;
  disabled?: boolean;
}

export default function RecentServers({
  servers,
  onSelectServer,
  onRemoveServer,
  disabled = false,
}: RecentServersProps) {
  if (!servers || servers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexões Recentes</Text>
      <View style={styles.listContainer}>
        {servers.map((url, index) => (
          <View key={url} style={[styles.item, index === servers.length - 1 ? styles.lastItem : null]}>
            <TouchableOpacity
              style={styles.clickableArea}
              onPress={() => onSelectServer(url)}
              disabled={disabled}
              activeOpacity={0.6}
            >
              <Text style={styles.icon}>🌐</Text>
              <Text style={styles.urlText} numberOfLines={1}>
                {url}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveServer(url)}
              disabled={disabled}
              activeOpacity={0.6}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  listContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 16,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  clickableArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  urlText: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
