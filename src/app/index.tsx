import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ServerForm from '@/components/ServerForm';
import DemoServers from '@/components/DemoServers';
import RecentServers from '@/components/RecentServers';
import TraccarWebView from '@/components/TraccarWebView';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorOverlay from '@/components/ErrorOverlay';
import { LOGO_BASE64 } from '@/constants/logoBase64';

const STORAGE_KEY_URL = '@traccar_url';
const STORAGE_KEY_RECENT = '@traccar_recent';
const DEFAULT_TRACCAR_URL = 'https://demo.traccar.org';

export default function HomeScreen() {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const webviewRef = useRef<any>(null);

  // JavaScript to inject into the Traccar web interface
  // JavaScript to inject into the Traccar web interface
  const injectedJavaScript = `
    (function() {
      function setReactInputValue(input, value) {
        var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (nativeSetter) {
          nativeSetter.call(input, value);
        } else {
          input.value = value;
        }
        var ev = new Event('input', { bubbles: true });
        input.dispatchEvent(ev);
      }

      function autoLogin() {
        // Only run auto-login on the default demo server
        if (window.location.href.indexOf('demo.traccar.org') === -1) return;

        var emailInput = document.querySelector('input[type="email"], input[name="email"], #email');
        var passwordInput = document.querySelector('input[type="password"], input[name="password"], #password');
        var submitBtn = document.querySelector('button[type="submit"], form button');

        if (emailInput && passwordInput && submitBtn) {
          if (emailInput.value !== 'traccardemomonitor@gmail.com') {
            setReactInputValue(emailInput, 'traccardemomonitor@gmail.com');
            setReactInputValue(passwordInput, 'TraccarDemo123!');
            setTimeout(function() {
              submitBtn.click();
            }, 150);
          }
        }
      }

      function replaceLogo() {
        // 1. Target the SVG logo in the Login page
        var svgs = document.querySelectorAll('svg');
        svgs.forEach(function(svg) {
          var isLogo = svg.getAttribute('viewBox') === '0 0 240 64' ||
                       svg.getAttribute('viewBox') === '0 0 240 120' ||
                       svg.querySelector('#rect3778') !== null ||
                       svg.querySelector('#path2993') !== null;
          if (isLogo && !svg.hasAttribute('data-replaced')) {
            var parent = svg.parentNode;
            if (parent) {
              var img = document.createElement('img');
              img.src = '${LOGO_BASE64}';
              img.style.maxWidth = '240px';
              img.style.maxHeight = '64px';
              img.style.objectFit = 'contain';
              img.style.display = 'block';
              img.style.margin = 'auto';
              img.setAttribute('data-replaced', 'true');
              
              // Secret trigger: double click the logo to open native settings
              img.addEventListener('dblclick', function() {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage('open-settings');
                }
              });
              
              svg.style.display = 'none';
              svg.setAttribute('data-replaced', 'true');
              parent.appendChild(img);
            }
          }
        });

        // 2. Target standard image tags that might be logos
        var imgs = document.querySelectorAll('img');
        imgs.forEach(function(img) {
          var src = img.src || '';
          if ((src.indexOf('logo') !== -1 || src.indexOf('traccar') !== -1) && !img.hasAttribute('data-replaced') && src.indexOf('base64') === -1) {
            img.setAttribute('data-replaced', 'true');
            img.src = '${LOGO_BASE64}';
            img.addEventListener('dblclick', function() {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('open-settings');
              }
            });
          }
        });

        // 3. Target top navbar header title or company name
        var title = document.querySelector('header h6, header p, .logo-text, .brand-text');
        if (title && title.textContent && (title.textContent.indexOf('Traccar') !== -1 || title.textContent.indexOf('Meu') !== -1) && !title.hasAttribute('data-replaced')) {
          title.setAttribute('data-replaced', 'true');
          title.textContent = 'Meu Rastreador';
          title.style.cursor = 'pointer';
          
          // Secret trigger: double click the header title to open settings
          title.addEventListener('dblclick', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage('open-settings');
            }
          });
        }
      }

      // Check and execute automation periodically to handle React lifecycles
      autoLogin();
      replaceLogo();
      setInterval(function() {
        autoLogin();
        replaceLogo();
      }, 800);
    })();
    true;
  `;

  // Load saved configurations on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const storedUrl = await AsyncStorage.getItem(STORAGE_KEY_URL);
        const storedRecent = await AsyncStorage.getItem(STORAGE_KEY_RECENT);

        if (storedUrl) {
          setSavedUrl(storedUrl);
        } else {
          // If no URL is saved yet, connect to the default demo server immediately
          await AsyncStorage.setItem(STORAGE_KEY_URL, DEFAULT_TRACCAR_URL);
          setSavedUrl(DEFAULT_TRACCAR_URL);
        }

        if (storedRecent) {
          setRecentUrls(JSON.parse(storedRecent));
        } else {
          // Initialize recent list with the default demo server
          const initialRecent = [DEFAULT_TRACCAR_URL];
          await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(initialRecent));
          setRecentUrls(initialRecent);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsAppLoading(false);
      }
    }
    loadSettings();
  }, []);

  // For Web target iframe logo replacement (same-origin only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const interval = setInterval(() => {
      try {
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            // Replace SVG logo
            const svgs = doc.querySelectorAll('svg');
            svgs.forEach((svg) => {
              const isLogo = svg.getAttribute('viewBox') === '0 0 240 64' ||
                             svg.querySelector('#rect3778') !== null ||
                             svg.querySelector('#path2993') !== null;
              if (isLogo && !svg.hasAttribute('data-replaced')) {
                const parent = svg.parentNode;
                if (parent) {
                  const img = doc.createElement('img');
                  img.src = LOGO_BASE64;
                  img.style.maxHeight = '64px';
                  img.style.width = 'auto';
                  img.style.objectFit = 'contain';
                  img.style.display = 'block';
                  img.style.margin = 'auto';
                  img.setAttribute('data-replaced', 'true');

                  // Secret trigger
                  img.addEventListener('dblclick', () => {
                    setIsSettingsOpen(true);
                  });

                  svg.style.display = 'none';
                  svg.setAttribute('data-replaced', 'true');
                  parent.appendChild(img);
                }
              }
            });

            // Replace image tags
            const imgs = doc.querySelectorAll('img');
            imgs.forEach((img: any) => {
              const src = img.src || '';
              if ((src.includes('logo') || src.includes('traccar')) && !img.hasAttribute('data-replaced') && !src.includes('base64')) {
                img.setAttribute('data-replaced', 'true');
                img.src = LOGO_BASE64;
                img.addEventListener('dblclick', () => {
                  setIsSettingsOpen(true);
                });
              }
            });

            // Replace header text
            const title = doc.querySelector('header h6, header p, .logo-text, .brand-text') as HTMLElement | null;
            if (title && title.textContent && (title.textContent.includes('Traccar') || title.textContent.includes('Meu')) && !title.hasAttribute('data-replaced')) {
              title.setAttribute('data-replaced', 'true');
              title.textContent = 'Meu Rastreador';
              title.style.cursor = 'pointer';
              title.addEventListener('dblclick', () => {
                setIsSettingsOpen(true);
              });
            }
          }
        }
      } catch {
        // Cross-origin security block (expected for cross-domain iframes)
      }
    }, 800);

    return () => clearInterval(interval);
  }, [savedUrl]);

  // Handle server connection form submit
  const handleConnect = async (url: string) => {
    try {
      setIsWebViewLoading(true);
      setErrorMsg(null);
      setIsSettingsOpen(false); // Close settings modal if open

      // Save as the current URL
      await AsyncStorage.setItem(STORAGE_KEY_URL, url);
      setSavedUrl(url);

      // Update recent URLs list (move to top, max 5 entries, no duplicates)
      const updatedRecent = [url, ...recentUrls.filter((item) => item !== url)].slice(0, 5);
      await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updatedRecent));
      setRecentUrls(updatedRecent);
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMsg('Falha ao salvar as configurações.');
      setIsWebViewLoading(false);
    }
  };

  // Remove a server from the recent list
  const handleRemoveRecent = async (urlToRemove: string) => {
    try {
      const updatedRecent = recentUrls.filter((url) => url !== urlToRemove);
      await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updatedRecent));
      setRecentUrls(updatedRecent);
    } catch (err) {
      console.error('Error removing recent URL:', err);
    }
  };

  // WebView navigation actions (for reload/retry from error screens)
  const handleReload = () => {
    setErrorMsg(null);
    setIsWebViewLoading(true);
    if (webviewRef.current) {
      if (Platform.OS === 'web') {
        if (webviewRef.current.contentWindow) {
          webviewRef.current.contentWindow.location.reload();
        } else {
          const currentUrl = savedUrl;
          setSavedUrl(null);
          setTimeout(() => setSavedUrl(currentUrl), 50);
        }
      } else {
        webviewRef.current.reload();
      }
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    // Navigation tracking removed along with navigation controls
  };

  const handleWebViewError = (description: string) => {
    setErrorMsg(description);
    setIsWebViewLoading(false);
  };

  const handleMessage = (event: any) => {
    const data = event.nativeEvent.data;
    if (data === 'open-settings') {
      setIsSettingsOpen(true);
    }
  };

  if (isAppLoading || !savedUrl) {
    return <LoadingOverlay message="Inicializando aplicativo..." />;
  }

  return (
    <SafeAreaView style={styles.appContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.webviewContainer}>
        <TraccarWebView
          url={savedUrl}
          webviewRef={webviewRef}
          onLoadStart={() => setIsWebViewLoading(true)}
          onLoadEnd={() => setIsWebViewLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleWebViewError}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
        />

        {/* Overlays floating above the webview */}
        {isWebViewLoading && <LoadingOverlay message="Carregando painel..." />}
        
        {errorMsg && (
          <ErrorOverlay
            errorMsg={errorMsg}
            onRetry={handleReload}
            onChangeUrl={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Settings modal to edit server URL */}
        <Modal
          visible={isSettingsOpen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsSettingsOpen(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsSettingsOpen(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕ Fechar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Configurações</Text>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {/* Logo Section */}
                <View style={styles.logoHeader}>
                  <Image
                    source={{ uri: LOGO_BASE64 }}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.title}>Rastreador</Text>
                  <Text style={styles.subtitle}>Ajustar Servidor de Rastreamento</Text>
                </View>

                {/* Main Input Form */}
                <ServerForm onSubmit={handleConnect} isLoading={isWebViewLoading} />

                {/* Quick Demo Connections */}
                <DemoServers onSelectServer={handleConnect} disabled={isWebViewLoading} />

                {/* Saved History */}
                <RecentServers
                  servers={recentUrls}
                  onSelectServer={handleConnect}
                  onRemoveServer={handleRemoveRecent}
                  disabled={isWebViewLoading}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    position: 'relative',
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    height: '100%',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});
