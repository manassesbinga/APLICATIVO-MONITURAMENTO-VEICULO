# Traccar Manager - Custom Mobile & Web Client 📡

Este projeto é um cliente customizado interno da empresa que empacota a interface web do **Traccar GPS Tracking** em uma experiência de aplicativo móvel e web nativa, fluida e com identidade visual 100% personalizada por meio de injeção dinâmica de DOM.

---

## 🚀 Principais Recursos

- **Conexão Direta & Auto-Login:** O aplicativo conecta-se automaticamente ao servidor Traccar padrão (`demo.traccar.org`) e realiza o login automático de forma instantânea e transparente com uma conta de demonstração dedicada, levando o usuário direto para o painel de rastreamento.
- **Zero Distração (Interface Clean):** Removemos todas as barras de navegação físicas ou controles flutuantes sobrepostos. A interface do mapa do Traccar ocupa 100% da tela útil do dispositivo.
- **Customização de Logo via Injeção de Código:** O aplicativo injeta dinamicamente estilos e scripts que detectam o logotipo original do Traccar (seja SVG, imagem ou texto de cabeçalho) e o substituem pelo nosso logotipo corporativo em Base64, preservando a proporção de dimensões original.
- **Menu Secreto de Ajustes:** O acesso às configurações do servidor (como trocar o endereço IP/servidor ou ver históricos de conexão) é acionado por um **mecanismo de duplo clique (double click)** no logotipo ou na barra de títulos da página web. Isso abre uma tela nativa de configurações no celular.
- **Suporte Multiplataforma Inteligente:**
  - **Celulares (Android/iOS):** Utiliza a biblioteca nativa `react-native-webview` com suporte completo a geolocalização nativa para que o mapa encontre a posição do aparelho em tempo real.
  - **Web (Navegadores):** Utiliza um container `iframe` responsivo e elegante.

---

## 📱 Demonstração do Aplicativo

Abaixo estão capturas de tela do aplicativo rodando no simulador do iPhone 14 Pro, ilustrando a identidade visual personalizada da empresa e o fluxo de telas:

<p align="center">
  <img src="./assets/iphone-login.png" width="30%" alt="Tela de Login Customizada" />
  <img src="./assets/iphone-settings.png" width="30%" alt="Menu Secreto de Ajustes" />
  <img src="./assets/iphone-map.png" width="30%" alt="Painel do Mapa de Rastreamento" />
</p>

---

## 🛠️ Como Funciona a Injeção de Código (WebView vs. Web Iframe)

Como a aplicação exibe um painel hospedado remotamente, a injeção da logo e do login automático ocorre em duas camadas:

### 1. Aplicativo Móvel (WebView Nativo)
A `WebView` do celular possui privilégios de sistema para injetar código Javascript arbitrário (`injectedJavaScript`) no contexto de qualquer página carregada, independentemente do domínio. O script é executado periodicamente a cada 800ms para interceptar renderizações dinâmicas do React, detectando a logo original através do seu `viewBox` (`0 0 240 64`), ID de caminhos internos do SVG (`#path2993`, `#rect3778`), ou o texto "Traccar". Ao encontrar, substitui pelo nosso logotipo em Base64 e anexa o evento secreto de clique.

### 2. Navegador Web (Iframe)
No ambiente de navegador web do computador (PC), os navegadores aplicam a **Política de Mesma Origem (CORS/Same-Origin Policy)**. 
- **Em domínios diferentes (Cross-Origin):** O navegador bloqueará a injeção no iframe por motivos de segurança.
- **No mesmo domínio (Same-Origin):** Se o bundle web deste app for hospedado no mesmo servidor onde o Traccar está rodando, a injeção funcionará perfeitamente no PC, interceptando o iframe e aplicando a personalização de logo e login.

---

## 📂 Estrutura de Diretórios Principal

```text
├── assets/
│   └── images/                 # Contém as imagens convertidas em PNG legítimo pelo .NET
│       ├── icon.png            # Ícone oficial do aplicativo
│       ├── favicon.png         # Ícone de aba do navegador
│       └── splash-icon.png     # Logo de carregamento (splash)
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Configuração base de rotas do Expo Router
│   │   └── index.tsx           # Orquestrador da WebView, Modal de Ajustes e injeção de JS
│   ├── components/
│   │   ├── ServerForm.tsx      # Formulário de URL com validações de regex
│   │   ├── DemoServers.tsx     # Conexões rápidas a servidores demo oficiais
│   │   ├── RecentServers.tsx   # Histórico de servidores salvos com AsyncStorage
│   │   ├── LoadingOverlay.tsx  # Tela de loading premium com animações
│   │   ├── ErrorOverlay.tsx    # Tela de erro/offline de rede com retry automático
│   │   └── TraccarWebView.tsx  # Wrapper do WebView com suporte nativo/iframe
│   └── constants/
│       └── logoBase64.ts       # Constante que armazena a string Base64 do logotipo customizado
```

---

## 🚀 Como Iniciar e Testar

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) e o [pnpm](https://pnpm.io/) instalados em sua máquina.

### 1. Instalar as Dependências
Execute o comando a seguir na raiz do projeto:
```bash
pnpm install
```

### 2. Compilar e Gerar o APK (Android)

Para compilar o aplicativo em um arquivo APK executável no celular, existem dois métodos principais:

#### Método A: Compilação Local (Gradle)
Este método gera o APK diretamente na sua máquina local utilizando o Gradle. Certifique-se de ter o [Java Development Kit (JDK)](https://adoptium.net/) instalado.

1. Gere os arquivos nativos do projeto Android:
   ```bash
   npx expo prebuild --platform android
   ```
2. Navegue para o diretório nativo e compile o APK (Debug ou Release):
   - **Para gerar APK de testes (Debug):**
     ```powershell
     cd android
     .\gradlew.bat assembleDebug
     ```
     *O APK será salvo em:* `android\app\build\outputs\apk\debug\app-debug.apk`
   
   - **Para gerar APK de produção (Release):**
     ```powershell
     cd android
     .\gradlew.bat assembleRelease
     ```
     *O APK será salvo em:* `android\app\build\outputs\apk\release\app-release.apk`

#### Método B: Compilação na Nuvem (Expo EAS Build)
Se preferir compilar pela nuvem da Expo, você pode gerar um APK configurando o EAS:

1. Instale o EAS CLI (se não possuir):
   ```bash
   npm install -g eas-cli
   ```
2. Inicialize a configuração do build:
   ```bash
   npx eas build:configure
   ```
3. Execute a compilação do APK para testes internos:
   ```bash
   npx eas build --platform android --profile preview
   ```
   *Isso gerará um arquivo APK pronto para download diretamente no painel do Expo.*

# APLICATIVO-MONITURAMENTO-VEICULO
