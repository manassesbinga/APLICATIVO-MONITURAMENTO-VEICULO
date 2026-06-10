import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface DemoServersProps {
  onSelectServer: (url: string) => void;
  disabled?: boolean;
}

const DEMO_SERVERS = [
  { id: 'demo1', name: 'Demo Server 1', url: 'https://demo.traccar.org', region: 'Global' },
  { id: 'demo2', name: 'Demo Server 2', url: 'https://demo2.traccar.org', region: 'Global' },
  { id: 'demo3', name: 'Demo Server 3', url: 'https://demo3.traccar.org', region: 'Global' },
  { id: 'demo4', name: 'Demo Server 4', url: 'https://demo4.traccar.org', region: 'Global' },
];

export default function DemoServers({ onSelectServer, disabled = false }: DemoServersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servidores de Teste (Demo)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DEMO_SERVERS.map((server) => (
          <TouchableOpacity
            key={server.id}
            style={[styles.card, disabled ? styles.cardDisabled : null]}
            onPress={() => onSelectServer(server.url)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{server.region}</Text>
            </View>
            <Text style={styles.name}>{server.name}</Text>
            <Text style={styles.url} numberOfLines={1}>
              {server.url.replace('https://', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
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
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  url: {
    fontSize: 11,
    color: '#64748B',
  },
});
