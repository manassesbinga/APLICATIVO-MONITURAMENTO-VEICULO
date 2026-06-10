import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface TraccarWebViewProps {
  url: string;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onNavigationStateChange: (navState: any) => void;
  onError: (errorMsg: string) => void;
  webviewRef: React.RefObject<any>;
  injectedJavaScript?: string;
  onMessage?: (event: any) => void;
}

export default function TraccarWebView({
  url,
  onLoadStart,
  onLoadEnd,
  onNavigationStateChange,
  onError,
  webviewRef,
  injectedJavaScript,
  onMessage,
}: TraccarWebViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        {/* Simple web fallback with iframe */}
        <iframe
          ref={webviewRef as any}
          src={url}
          style={iframeStyle}
          onLoad={() => {
            onLoadEnd();
            // Try to fake basic navigation changes if possible (though limited by cross-origin policies)
            onNavigationStateChange({
              canGoBack: false,
              canGoForward: false,
              title: 'Traccar Manager',
              url: url,
            });
          }}
        />
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: url }}
      style={styles.webview}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      geolocationEnabled={true}
      startInLoadingState={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onNavigationStateChange={onNavigationStateChange}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        onError(nativeEvent.description || 'Erro de rede ou servidor não responde.');
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        if (nativeEvent.statusCode >= 400) {
          onError(`Servidor retornou erro HTTP ${nativeEvent.statusCode}`);
        }
      }}
    />
  );
}

const iframeStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
  backgroundColor: '#0F172A',
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
});
