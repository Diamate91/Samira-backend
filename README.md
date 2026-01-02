# 🌙 Wiedźma Samira - Backend API

Backend serwer do obsługi wysyłania emaili z auto-reply przy użyciu Resend.

## 📋 Spis Treści

- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Wymagania

- **Node.js** 18+ (sprawdź: `node --version`)
- **npm** lub **pnpm**
- **Resend Account** (darmowy plan: 3000 emaili/miesiąc)

---

## 📦 Instalacja

### 1. Przejdź do folderu backend

```bash
cd backend
```

### 2. Zainstaluj dependencies

```bash
npm install
```

**Instalowane paczki:**
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `resend` - Email sending service

---

## ⚙️ Konfiguracja

### 1. Stwórz plik `.env`

```bash
cp .env.example .env
```

### 2. Zdobądź Resend API Key

**Krok po kroku:**

1. **Zarejestruj się na Resend:**
   - Wejdź na: https://resend.com
   - Kliknij "Sign Up" (darmowe konto)
   - Potwierdź email

2. **Stwórz API Key:**
   - Zaloguj się do panelu Resend
   - Przejdź do: **API Keys** (lewy sidebar)
   - Kliknij: **"Create API Key"**
   - Nadaj nazwę: `Wiedzma-Samira-Production`
   - Skopiuj klucz (zaczyna się od `re_...`)

3. **Dodaj do `.env`:**
   ```env
   RESEND_API_KEY=re_twoj_klucz_tutaj
   ```

### 3. Skonfiguruj domeny w Resend

**Dla testów (użyj domyślnej domeny):**
```env
RESEND_FROM_EMAIL=Wiedźma Samira <onboarding@resend.dev>
```

**Dla produkcji (dodaj swoją domenę):**

1. W panelu Resend → **Domains** → **Add Domain**
2. Wpisz swoją domenę: `wiedzmasamira.pl`
3. Dodaj DNS records (Resend pokaże instrukcje)
4. Poczekaj na weryfikację (5-30 minut)
5. Zmień w `.env`:
   ```env
   RESEND_FROM_EMAIL=Wiedźma Samira <noreply@wiedzmasamira.pl>
   ```

### 4. Uzupełnij `.env`

```env
# Server
PORT=3001
NODE_ENV=development

# Resend
RESEND_API_KEY=re_twoj_klucz

# Email addresses
OWNER_EMAIL=twoj-email@example.com
RESEND_FROM_EMAIL=Wiedźma Samira <onboarding@resend.dev>

# URLs
FRONTEND_URL=http://localhost:5173
SITE_URL=https://www.wiedzmasamira.pl
```

---

## 🚀 Uruchomienie

### Development (z auto-restart)

```bash
npm run dev
```

**Zobaczysz:**
```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🌙 Wiedźma Samira Backend API 🌙                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:3001
🏥 Health check: http://localhost:3001/health
📧 Email endpoint: http://localhost:3001/api/send-email

🔐 Resend API Key: ✅ Configured
📨 Owner Email: twoj-email@example.com
🌐 Frontend URL: http://localhost:5173
```

### Production

```bash
npm start
```

### Test endpointu

**Health check:**
```bash
curl http://localhost:3001/health
```

**Odpowiedź:**
```json
{
  "status": "ok",
  "message": "Wiedźma Samira Backend API is running",
  "timestamp": "2024-01-02T12:00:00.000Z"
}
```

---

## 📡 API Endpoints

### 1. Health Check

**GET** `/health`

Sprawdza czy serwer działa.

**Response:**
```json
{
  "status": "ok",
  "message": "Wiedźma Samira Backend API is running",
  "timestamp": "2024-01-02T12:00:00.000Z"
}
```

---

### 2. Send Email with Auto-Reply

**POST** `/api/send-email`

Wysyła email do właściciela + auto-reply do użytkownika.

**Request Body:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "service": "Tarot Miłosny",
  "message": "Chciałbym umówić sesję na środę o 15:00."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email wysłany pomyślnie! Otrzymasz odpowiedź w ciągu 24 godzin. 🌙",
  "data": {
    "ownerEmailId": "abc123",
    "autoReplyId": "xyz789"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Wszystkie pola są wymagane (name, email, service, message)"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później."
}
```

---

### Przykład wywołania z JavaScript:

```javascript
const response = await fetch('http://localhost:3001/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    service: 'Tarot Miłosny',
    message: 'Chciałbym umówić sesję.'
  })
});

const data = await response.json();
console.log(data);
```

---

## 🌐 Deployment

### Opcja 1: Vercel (Najłatwiejsza)

**1. Zainstaluj Vercel CLI:**
```bash
npm i -g vercel
```

**2. Deploy:**
```bash
cd backend
vercel
```

**3. Dodaj Environment Variables w Vercel Dashboard:**
- `RESEND_API_KEY`
- `OWNER_EMAIL`
- `RESEND_FROM_EMAIL`
- `FRONTEND_URL`
- `SITE_URL`

**4. Zaktualizuj frontend `.env`:**
```env
VITE_API_BASE_URL=https://your-backend.vercel.app
```

---

### Opcja 2: Railway

**1. Stwórz konto na Railway.app**

**2. Nowy projekt:**
- Connect GitHub repo
- Railway auto-wykryje Node.js

**3. Dodaj Environment Variables**

**4. Deploy automatyczny przy push**

---

### Opcja 3: Render

**1. Stwórz konto na Render.com**

**2. New Web Service:**
- Build Command: `npm install`
- Start Command: `npm start`

**3. Dodaj Environment Variables**

**4. Deploy**

---

### Opcja 4: VPS (DigitalOcean, Linode, etc.)

**1. Połącz przez SSH:**
```bash
ssh user@your-server-ip
```

**2. Sklonuj repo:**
```bash
git clone https://github.com/your-repo.git
cd your-repo/backend
```

**3. Zainstaluj dependencies:**
```bash
npm install
```

**4. Stwórz `.env`**

**5. Zainstaluj PM2:**
```bash
npm i -g pm2
pm2 start server.js --name wiedzma-backend
pm2 save
pm2 startup
```

**6. Konfiguruj Nginx jako reverse proxy:**
```nginx
server {
  listen 80;
  server_name api.wiedzmasamira.pl;

  location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

---

## 🧪 Testowanie

### Test lokalny z cURL:

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "Tarot Miłosny",
    "message": "To jest testowa wiadomość."
  }'
```

### Test z Postman:

1. Stwórz nowy request
2. Method: **POST**
3. URL: `http://localhost:3001/api/send-email`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "name": "Test",
     "email": "test@example.com",
     "service": "Tarot Miłosny",
     "message": "Test"
   }
   ```
6. Send

### Test Script (Automated):

**Najłatwiejszy sposób:**

```bash
npm test
```

**To uruchomi automatyczne testy które sprawdzą:**
- ✅ Health Check endpoint
- ✅ Wysyłanie emaili
- ✅ Walidację danych
- ✅ Obsługę błędów

**Output:**
```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🧪 Wiedźma Samira Backend API Tests 🧪           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

🎯 Testing API: http://localhost:3001

🏥 Testing Health Check...
✅ Health Check PASSED

📧 Testing Send Email...
✅ Email Test PASSED
📬 Check your inbox for:
   1. Owner notification
   2. Auto-reply

📊 TEST SUMMARY
════════════════════════════════════════════════════════════
✅ Health Check                PASSED
✅ Send Email                  PASSED
✅ Invalid Data Handling       PASSED
✅ Invalid Email Validation    PASSED
════════════════════════════════════════════════════════════

🎯 Results: 4/4 tests passed (100%)
✨ ALL TESTS PASSED! Backend is working perfectly! ✨
```

**Test produkcji:**
```bash
node test-email.js https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Problem: "RESEND_API_KEY is not configured"

**Rozwiązanie:**
1. Sprawdź czy `.env` istnieje w folderze `/backend/`
2. Upewnij się że `RESEND_API_KEY` jest ustawione
3. Restartuj serwer: `Ctrl+C` → `npm run dev`

---

### Problem: "From email address not verified"

**Rozwiązanie:**
- **Development:** Użyj `onboarding@resend.dev` (działa od razu)
- **Production:** Dodaj i zweryfikuj swoją domenę w Resend Dashboard

---

### Problem: CORS error w przeglądarce

**Rozwiązanie:**
1. Sprawdź `FRONTEND_URL` w `.env`
2. Upewnij się że frontend działa na tym adresie
3. Dla produkcji: dodaj właściwy URL domeny

---

### Problem: Port 3001 already in use

**Rozwiązanie:**

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID [PID] /F
```

**Mac/Linux:**
```bash
lsof -ti:3001 | xargs kill -9
```

Lub zmień port w `.env`:
```env
PORT=3002
```

---

## 📊 Monitoring Emaili

### Resend Dashboard

1. Zaloguj się na https://resend.com
2. **Emails** (lewy sidebar)
3. Zobacz wszystkie wysłane emaile:
   - Status (delivered, bounced, failed)
   - Timestamp
   - Recipients
   - Content preview

---

## 🔐 Bezpieczeństwo

### ✅ Dobre praktyki:

- ✅ **NIE commituj** pliku `.env` do Git
- ✅ Używaj `.gitignore` (już skonfigurowane)
- ✅ Różne API keys dla dev/production
- ✅ CORS skonfigurowany tylko dla Twojego frontendu
- ✅ Walidacja input danych
- ✅ Rate limiting (TODO dla produkcji)

### ⚠️ TODO dla produkcji:

- [ ] Dodaj rate limiting (express-rate-limit)
- [ ] Dodaj helmet.js dla security headers
- [ ] Konfiguruj HTTPS
- [ ] Logowanie do pliku/serwisu
- [ ] Monitoring (Sentry, LogRocket)

---

## 📝 Struktura Projektu

```
backend/
├── server.js           # Główny plik serwera
├── package.json        # Dependencies
├── .env.example        # Przykładowa konfiguracja
├── .env               # Twoja konfiguracja (nie w Git!)
├── .gitignore         # Ignorowane pliki
└── README.md          # Ta dokumentacja
```

---

## 🆘 Potrzebujesz Pomocy?

### Resend Documentation:
- https://resend.com/docs

### Express.js Documentation:
- https://expressjs.com

### Node.js Documentation:
- https://nodejs.org/docs

---

## ✨ Features

- ✅ Email notification do właściciela
- ✅ Auto-reply do użytkownika
- ✅ Piękne HTML emaile
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables
- ✅ Development & Production modes
- ✅ Health check endpoint
- ✅ Detailed logging

---

**Stworzono z 🌙 dla Wiedźmy Samiry**