# 🚀 Deployment Guide - Backend na Produkcję

Kompletny przewodnik wdrożenia backendu na różne platformy.

---

## 📋 Przygotowanie przed Deployment

### 1. Dodaj swoją domenę w Resend (WAŻNE!)

**Dlaczego:** `onboarding@resend.dev` działa tylko dla testów. Dla produkcji potrzebujesz własnej domeny.

**Kroki:**

1. **Zaloguj się na Resend.com**
2. **Lewy sidebar → Domains → Add Domain**
3. **Wpisz domenę:** `wiedzmasamira.pl` (bez www)
4. **Resend pokaże DNS records do dodania:**
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [długi kod]
   
   Type: MX
   Name: @
   Priority: 10
   Value: feedback-smtp.eu-west-1.amazonses.com
   ```

5. **Dodaj DNS records w swoim domain providerze:**
   - **OVH:** Panel → Domeny → DNS Zone
   - **home.pl:** Panel → Domeny → Zarządzaj DNS
   - **Cloudflare:** Dashboard → DNS
   - **GoDaddy:** Domains → DNS

6. **Poczekaj 5-30 minut** (propagacja DNS)

7. **Wróć do Resend → Verify** (przycisk zielony)

8. **✅ Status: Verified**

**Teraz możesz używać:**
```env
RESEND_FROM_EMAIL=Wiedźma Samira <noreply@wiedzmasamira.pl>
```

---

## 🌐 Opcja 1: Vercel (⭐ POLECAM - Najłatwiejsze)

**Czas setup:** 5 minut  
**Koszt:** Darmowe  
**Trudność:** ⭐ Bardzo łatwe

### Krok 1: Przygotuj projekt

W folderze `/backend/` stwórz plik `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Krok 2: Install Vercel CLI

```bash
npm i -g vercel
```

### Krok 3: Deploy

```bash
cd backend
vercel
```

**Odpowiedz na pytania:**
- Set up and deploy? **Y**
- Which scope? **[Wybierz swoje konto]**
- Link to existing project? **N**
- Project name? **wiedzma-samira-backend**
- Directory? **./** (lub zostaw puste)

**Vercel zbuduje i wdroży!**

### Krok 4: Dodaj Environment Variables

**Opcja A: Przez CLI**

```bash
vercel env add RESEND_API_KEY
# Wklej klucz i Enter

vercel env add OWNER_EMAIL
# Wpisz swój email

vercel env add RESEND_FROM_EMAIL
# Wpisz: Wiedźma Samira <noreply@wiedzmasamira.pl>

vercel env add FRONTEND_URL
# Wpisz: https://www.wiedzmasamira.pl

vercel env add SITE_URL
# Wpisz: https://www.wiedzmasamira.pl
```

**Opcja B: Przez Dashboard**

1. **Wejdź na:** https://vercel.com/dashboard
2. **Wybierz projekt:** wiedzma-samira-backend
3. **Settings → Environment Variables**
4. **Dodaj każdą zmienną:**
   - `RESEND_API_KEY` = `re_twoj_klucz`
   - `OWNER_EMAIL` = `twoj-email@example.com`
   - `RESEND_FROM_EMAIL` = `Wiedźma Samira <noreply@wiedzmasamira.pl>`
   - `FRONTEND_URL` = `https://www.wiedzmasamira.pl`
   - `SITE_URL` = `https://www.wiedzmasamira.pl`
   - `NODE_ENV` = `production`

### Krok 5: Redeploy

```bash
vercel --prod
```

**✅ URL backendu:**
```
https://wiedzma-samira-backend.vercel.app
```

### Krok 6: Zaktualizuj Frontend

W głównym `.env` projektu:

```env
VITE_API_BASE_URL=https://wiedzma-samira-backend.vercel.app
VITE_API_SEND_EMAIL_ENDPOINT=/api/send-email
VITE_ENABLE_EMAIL=true
```

**Rebuild frontend:**
```bash
npm run build
```

**✅ Gotowe!**

---

## 🚂 Opcja 2: Railway

**Czas setup:** 10 minut  
**Koszt:** $5/miesiąc (trial $5 gratis)  
**Trudność:** ⭐⭐ Łatwe

### Krok 1: Stwórz konto

1. Wejdź na: **https://railway.app**
2. Kliknij **"Start a New Project"**
3. Zaloguj się przez GitHub

### Krok 2: Deploy z GitHub

**Opcja A: Jeśli masz repo na GitHub:**

1. **New Project → Deploy from GitHub repo**
2. **Wybierz repo**
3. **Root Directory:** `/backend`
4. **Railway auto-wykryje Node.js**

**Opcja B: Deploy lokalnie:**

```bash
# Zainstaluj Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Deploy
railway up
```

### Krok 3: Dodaj Environment Variables

**W Railway Dashboard:**

1. **Settings → Variables**
2. **Add Variables:**
   ```
   RESEND_API_KEY=re_twoj_klucz
   OWNER_EMAIL=twoj-email@example.com
   RESEND_FROM_EMAIL=Wiedźma Samira <noreply@wiedzmasamira.pl>
   FRONTEND_URL=https://www.wiedzmasamira.pl
   SITE_URL=https://www.wiedzmasamira.pl
   NODE_ENV=production
   PORT=3001
   ```

### Krok 4: Generate Domain

1. **Settings → Networking**
2. **Generate Domain**
3. **Skopiuj URL:** `wiedzma-backend.railway.app`

### Krok 5: Zaktualizuj Frontend

```env
VITE_API_BASE_URL=https://wiedzma-backend.railway.app
```

**✅ Gotowe!**

---

## 🎨 Opcja 3: Render

**Czas setup:** 10 minut  
**Koszt:** Darmowe (z limitami)  
**Trudność:** ⭐⭐ Łatwe

### Krok 1: Stwórz konto

1. Wejdź na: **https://render.com**
2. **Sign Up** przez GitHub

### Krok 2: New Web Service

1. **Dashboard → New → Web Service**
2. **Connect repository** (lub deploy lokalnie)

### Krok 3: Konfiguracja

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Node

**Region:**
- Frankfurt (najbliżej Polski)

### Krok 4: Environment Variables

**Environment → Add Environment Variable:**

```
RESEND_API_KEY=re_twoj_klucz
OWNER_EMAIL=twoj-email@example.com
RESEND_FROM_EMAIL=Wiedźma Samira <noreply@wiedzmasamira.pl>
FRONTEND_URL=https://www.wiedzmasamira.pl
SITE_URL=https://www.wiedzmasamira.pl
NODE_ENV=production
```

### Krok 5: Deploy

**Kliknij "Create Web Service"**

Render automatycznie:
- ✅ Zbuduje projekt
- ✅ Uruchomi serwer
- ✅ Nada URL: `https://wiedzma-backend.onrender.com`

### Krok 6: Zaktualizuj Frontend

```env
VITE_API_BASE_URL=https://wiedzma-backend.onrender.com
```

**⚠️ UWAGA:** Darmowy plan Render ma:
- **Spin down** po 15 min nieaktywności
- Pierwsze request po spin down może trwać 30-60s

**Rozwiązanie:**
- Upgrade do płatnego ($7/m) - brak spin down
- Lub dodaj **cron job** co 10 min (ping health endpoint)

**✅ Gotowe!**

---

## 🖥️ Opcja 4: VPS (DigitalOcean, Linode, Hetzner)

**Czas setup:** 30-60 minut  
**Koszt:** $5-12/miesiąc  
**Trudność:** ⭐⭐⭐⭐ Zaawansowane

### Krok 1: Stwórz VPS

**DigitalOcean:**
1. Droplet → Create
2. Ubuntu 22.04 LTS
3. Basic Plan ($6/m)
4. Frankfurt datacenter

**Hetzner (tańsze):**
1. Cloud → Servers → Create
2. Ubuntu 22.04
3. CX11 (€4/m = ~17 zł)
4. Falkenstein (Niemcy)

### Krok 2: Połącz przez SSH

```bash
ssh root@your-server-ip
```

### Krok 3: Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

### Krok 4: Install Git

```bash
apt install -y git
```

### Krok 5: Clone repository

```bash
# Stwórz user (nie używaj root!)
adduser wiedzma
usermod -aG sudo wiedzma
su - wiedzma

# Clone repo
git clone https://github.com/twoje-repo.git
cd twoje-repo/backend

# Install dependencies
npm install
```

### Krok 6: Konfiguracja Environment

```bash
nano .env
```

**Wklej:**
```env
PORT=3001
NODE_ENV=production
RESEND_API_KEY=re_twoj_klucz
OWNER_EMAIL=twoj-email@example.com
RESEND_FROM_EMAIL=Wiedźma Samira <noreply@wiedzmasamira.pl>
FRONTEND_URL=https://www.wiedzmasamira.pl
SITE_URL=https://www.wiedzmasamira.pl
```

**Zapisz:** `Ctrl+X` → `Y` → `Enter`

### Krok 7: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Start backend
pm2 start server.js --name wiedzma-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

**Komendy PM2:**
```bash
pm2 status           # Status
pm2 logs             # Logi
pm2 restart all      # Restart
pm2 stop all         # Stop
```

### Krok 8: Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
```

**Konfiguracja:**

```bash
sudo nano /etc/nginx/sites-available/wiedzma-backend
```

**Wklej:**
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/wiedzma-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Krok 9: SSL (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (FREE!)
sudo certbot --nginx -d api.wiedzmasamira.pl
```

**Certbot auto-konfiguruje HTTPS!**

### Krok 10: DNS

W domain providerze dodaj A record:

```
Type: A
Name: api
Value: [IP twojego VPS]
```

### Krok 11: Firewall

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

**✅ Backend działa na:**
```
https://api.wiedzmasamira.pl
```

### Krok 12: Zaktualizuj Frontend

```env
VITE_API_BASE_URL=https://api.wiedzmasamira.pl
```

**✅ Gotowe!**

---

## 🔒 Bezpieczeństwo (Dla Produkcji)

### 1. Rate Limiting

**Install:**
```bash
npm install express-rate-limit
```

**W `server.js` dodaj:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 10, // Max 10 requestów
  message: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.'
});

app.use('/api/send-email', limiter);
```

### 2. Helmet.js (Security Headers)

```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 3. Environment Variables Validation

**Install:**
```bash
npm install joi
```

**Stwórz `config.js`:**
```javascript
import Joi from 'joi';

const envSchema = Joi.object({
  RESEND_API_KEY: Joi.string().required(),
  OWNER_EMAIL: Joi.string().email().required(),
  // ...
}).unknown();

const { error } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
```

---

## 📊 Monitoring

### Resend Dashboard

**Zobacz wszystkie emaile:**
1. https://resend.com/emails
2. Status: Delivered, Bounced, Failed
3. Kliki, otwarcia (z premium)

### Sentry (Error Tracking)

```bash
npm install @sentry/node
```

### LogRocket (Session Replay)

**Premium option** - zobacz co users robią

---

## 🧪 Testing Production

### Test Health

```bash
curl https://your-backend-url.com/health
```

### Test Email

```bash
curl -X POST https://your-backend-url.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Production",
    "email": "test@example.com",
    "service": "Tarot",
    "message": "Production test"
  }'
```

---

## ✅ Checklist Deployment

- [ ] Domena zweryfikowana w Resend
- [ ] DNS records dodane
- [ ] Backend wdrożony na platformie
- [ ] Environment variables ustawione
- [ ] SSL certificate (HTTPS) skonfigurowany
- [ ] Frontend `.env` zaktualizowany z production URL
- [ ] Test email wysłany i otrzymany
- [ ] Rate limiting dodany (opcjonalne)
- [ ] Monitoring setup (opcjonalne)
- [ ] Backup strategy (dla VPS)

---

## 🆘 Problemy?

### Email bounces
- ✅ Sprawdź czy domena jest zweryfikowana
- ✅ Zobacz Resend Dashboard → Emails → Status
- ✅ Upewnij się że DNS records są poprawne

### CORS errors
- ✅ `FRONTEND_URL` musi być dokładnie URL frontendu
- ✅ Bez trailing slash: ✅ `https://site.com` ❌ `https://site.com/`

### 502 Bad Gateway (VPS/Nginx)
- ✅ Sprawdź czy PM2 działa: `pm2 status`
- ✅ Zobacz logi: `pm2 logs`
- ✅ Restart: `pm2 restart all`

---

**Backend gotowy na produkcję! 🚀**

Polecam **Vercel** dla najprostszego setup lub **VPS** dla pełnej kontroli.
