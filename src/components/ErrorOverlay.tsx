import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface ErrorOverlayProps {
  errorMsg?: string;
  onRetry: () => void;
  onChangeUrl: () => void;
}

export default function ErrorOverlay({
  errorMsg = 'Não foi possível conectar ao servidor Traccar.',
  onRetry,
  onChangeUrl,
}: ErrorOverlayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>⚠️</Text>
        </View>
        <Text style={styles.title}>Falha na Conexão</Text>
        <Text style={styles.message}>{errorMsg}</Text>
        <Text style={styles.submessage}>
          Verifique se o servidor está online, se você digitou a URL correta ou se possui conexão com a internet.
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.changeButton} onPress={onChangeUrl} activeOpacity={0.8}>
          <Text style={styles.changeButtonText}>Configurar Outro Servidor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#F1F5F9',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  submessage: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 28,
  },
  retryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  changeButton: {
    width: '100%',
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  changeButtonText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
});
