import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface ServerFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function ServerForm({ onSubmit, isLoading = false }: ServerFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAndSubmit = () => {
    setError(null);
    let trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('A URL do servidor é obrigatória.');
      return;
    }

    // Automatically prepend https:// if the user didn't specify a scheme
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = 'http://' + trimmedUrl;
    }

    // Regular expression to validate standard URL/IP format
    const urlPattern = /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;

    if (!urlPattern.test(trimmedUrl)) {
      setError('Insira um endereço de servidor ou IP válido.');
      return;
    }

    onSubmit(trimmedUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Endereço do Servidor</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="exemplo.com ou 192.168.1.100"
          placeholderTextColor="#64748B"
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            if (error) setError(null);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!isLoading}
          onSubmitEditing={validateAndSubmit}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.helperText}>
        Insira o endereço do seu próprio servidor Traccar ou de um serviço hospedado.
      </Text>

      <TouchableOpacity
        style={[styles.button, isLoading ? styles.buttonDisabled : null]}
        onPress={validateAndSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Conectando...' : 'Conectar ao Servidor'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 18,
    color: '#F8FAFC',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  helperText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#1E3A8A',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
