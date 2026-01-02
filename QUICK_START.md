# ⚡ Quick Start - Backend Setup (5 minut)

Szybki przewodnik uruchomienia backendu z auto-reply.

---

## 🚀 Krok 1: Instalacja (2 min)

```bash
# Przejdź do folderu backend
cd backend

# Zainstaluj dependencies
npm install
```

**Instalowane paczki:**
- Express (web server)
- Resend (email sending)
- CORS (security)
- Dotenv (environment variables)

---

## 🔑 Krok 2: Resend API Key (2 min)

### A) Zarejestruj się na Resend

1. Wejdź na: **https://resend.com**
2. Kliknij **"Sign Up"** (darmowe konto)
3. Potwierdź email

### B) Stwórz API Key

1. Zaloguj się do panelu Resend
2. Lewy sidebar → **"API Keys"**
3. Kliknij **"Create API Key"**
4. Nadaj nazwę: `Wiedzma-Samira`
5. **SKOPIUJ KLUCZ** (zaczyna się od `re_...`)
   - ⚠️ Pokazuje się tylko raz! Zapisz go!

---

## ⚙️ Krok 3: Konfiguracja (1 min)

```bash
# Skopiuj przykładowy .env
cp .env.example .env
```

**Edytuj plik `.env`:**

```env
# 1. Wklej Resend API Key (z kroku 2)
RESEND_API_KEY=re_twoj_klucz_tutaj

# 2. Twój email (gdzie chcesz otrzymywać wiadomości)
OWNER_EMAIL=twoj-email@example.com

# 3. Email "od" (dla testów zostaw onboarding@resend.dev)
RESEND_FROM_EMAIL=Wiedźma Samira <onboarding@resend.dev>

# 4. Reszta (możesz zostawić default)
PORT=3001
FRONTEND_URL=http://localhost:5173
SITE_URL=https://www.wiedzmasamira.pl
NODE_ENV=development
```

**✅ Gotowe!**

---

## 🎉 Krok 4: Uruchomienie

```bash
npm run dev
```

**Powinieneś zobaczyć:**

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

**✅ Backend działa!**

---

## 🧪 Krok 5: Test

### Test 1: Health Check

Otwórz w przeglądarce:
```
http://localhost:3001/health
```

Powinieneś zobaczyć:
```json
{
  "status": "ok",
  "message": "Wiedźma Samira Backend API is running"
}
```

### Test 2: Wyślij testowy email

**Opcja A: cURL (Terminal)**

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jan Testowy",
    "email": "twoj-email@example.com",
    "service": "Tarot Miłosny",
    "message": "To jest test backend API."
  }'
```

**Opcja B: Postman**

1. Nowy request → **POST**
2. URL: `http://localhost:3001/api/send-email`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "name": "Jan Testowy",
     "email": "twoj-email@example.com",
     "service": "Tarot Miłosny",
     "message": "To jest test."
   }
   ```
5. Send

**Powinieneś otrzymać:**

✅ **2 emaile:**
1. **Na OWNER_EMAIL** - powiadomienie o nowej wiadomości
2. **Na email z formularza** - auto-reply od Wiedźmy Samiry

---

## 🌐 Krok 6: Połącz Frontend

### A) Zaktualizuj `.env` w **głównym folderze projektu** (nie w backend!)

```bash
# W root projektu (gdzie jest /src/)
cd ..
```

**Edytuj `.env` (lub stwórz jeśli nie ma):**

```env
# Email Configuration
VITE_ENABLE_EMAIL=true
VITE_API_BASE_URL=http://localhost:3001
VITE_API_SEND_EMAIL_ENDPOINT=/api/send-email
```

### B) Uruchom frontend

W **nowym terminalu** (backend musi być uruchomiony!):

```bash
# Upewnij się że jesteś w root projektu
npm run dev
```

**Otwórz:** http://localhost:5173

### C) Wypełnij formularz kontaktowy na stronie

1. Scroll do sekcji "Kontakt"
2. Wypełnij formularz
3. Kliknij "Wyślij"
4. ✅ Powinieneś otrzymać emaile!

---

## ✅ Checklist Setup

- [ ] `npm install` wykonane
- [ ] Konto Resend utworzone
- [ ] API Key skopiowany
- [ ] `.env` utworzony i wypełniony
- [ ] `RESEND_API_KEY` ustawiony
- [ ] `OWNER_EMAIL` ustawiony
- [ ] Backend uruchomiony (`npm run dev`)
- [ ] Health check działa (http://localhost:3001/health)
- [ ] Test email wysłany i otrzymany
- [ ] Frontend `.env` zaktualizowany
- [ ] Frontend uruchomiony
- [ ] Formularz na stronie działa

---

## 🐛 Problemy?

### "Error: Invalid API key"
- ✅ Sprawdź czy API key jest poprawnie skopiowany w `.env`
- ✅ Upewnij się że nie ma spacji przed/po kluczu
- ✅ Klucz powinien zaczynać się od `re_`

### "CORS error" w przeglądarce
- ✅ Sprawdź czy `FRONTEND_URL` w backend `.env` to `http://localhost:5173`
- ✅ Upewnij się że frontend działa na tym porcie

### "Port 3001 already in use"
- ✅ Zmień `PORT=3002` w `.env`
- ✅ Zaktualizuj `VITE_API_BASE_URL` w frontend `.env`

### "Cannot find module 'express'"
- ✅ Uruchom `npm install` w folderze `/backend/`

### Nie otrzymujesz emaili
- ✅ Sprawdź folder SPAM
- ✅ Upewnij się że `OWNER_EMAIL` jest poprawny
- ✅ Zobacz logi w terminalu (powinny pokazać email IDs)
- ✅ Sprawdź Resend Dashboard → Emails (zobacz status)

---

## 📚 Więcej Informacji

- **Pełna dokumentacja:** [README.md](./README.md)
- **Resend Docs:** https://resend.com/docs
- **Deployment Guide:** [README.md](./README.md#deployment)

---

## 🎯 Następne Kroki

### Dla Produkcji:

1. **Dodaj swoją domenę w Resend:**
   - Panel Resend → Domains → Add Domain
   - Dodaj DNS records
   - Zmień `RESEND_FROM_EMAIL` na `noreply@wiedzmasamira.pl`

2. **Deploy backend:**
   - Vercel (najłatwiejsze)
   - Railway
   - Render
   - VPS (zaawansowane)

3. **Zaktualizuj frontend `.env` na produkcji:**
   ```env
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

4. **Dodaj rate limiting** (opcjonalne, dla bezpieczeństwa)

5. **Monitoring** (opcjonalne):
   - Resend Dashboard dla email statusów
   - Sentry dla error tracking
   - LogRocket dla session replay

---

**Gotowe! Backend z auto-reply działa! 🎉**

**Każda wiadomość z formularza wysyła:**
1. 📧 Email do Ciebie (powiadomienie)
2. 🌙 Auto-reply do klienta (piękny email z podziękowaniem)

**Wszystko automatycznie!** ✨
