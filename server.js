import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);

// Helpers
const escapeHtml = (input = "") =>
  String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// CORS (dev + prod)
const allowedOrigins = [
  process.env.FRONTEND_URL, // np. http://localhost:5173
  process.env.SITE_URL, // np. https://www.wrozka-samira.pl
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // pozwól na brak origin (np. curl/postman)
      if (!origin) return cb(null, true);

      // jeśli frontend i backend są na tej samej domenie, przeglądarka i tak traktuje to jako same-origin
      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Wiedźma Samira Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// POST /api/send-email
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, service, message } = req.body ?? {};

    // Basic request log (bez nagłówków i bez pełnego body)
    console.log("\n" + "=".repeat(80));
    console.log("📧 NEW EMAIL REQUEST");
    console.log("⏰", new Date().toLocaleString("pl-PL"));
    console.log("🌐 IP:", req.ip);
    console.log("📦 Fields:", {
      name: !!name,
      email: !!email,
      service: !!service,
      messageLength: typeof message === "string" ? message.length : 0,
    });
    console.log("=".repeat(80));

    // Validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Wszystkie pola są wymagane (name, email, service, message)",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Nieprawidłowy adres email",
      });
    }

    // ENV config
    const ownerTo = process.env.OWNER_EMAIL; // np. twojawrozkasamira@gmail.com
    if (!ownerTo) {
      return res.status(500).json({
        success: false,
        message: "Brak konfiguracji OWNER_EMAIL na serwerze.",
      });
    }

    // Wysyłaj zawsze z własnej domeny (po weryfikacji w Resend)
    // Najlepiej w formacie: "Wróżka Samira <kontakt@wrozka-samira.pl>"
    const from = process.env.RESEND_FROM_EMAIL || "kontakt@wrozka-samira.pl";

    // Sanitization do HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // 1) Mail do właściciela (Reply-To ustaw na klienta)
    const ownerEmail = await resend.emails.send({
      from,
      to: ownerTo,
      replyTo: email, // klikniesz "Odpowiedz" i leci do klienta
      subject: `🌙 Nowa wiadomość od ${safeName} - ${safeService}`,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color:#333; margin:0; padding:0; background:#f5f6fa; }
      .wrap { max-width: 640px; margin: 0 auto; padding: 20px; }
      .card { background:#ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
      .title { font-size: 20px; font-weight: 700; margin: 0 0 12px; }
      .meta { font-size: 14px; color:#666; margin: 0 0 18px; }
      .label { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color:#6b5bd6; margin: 18px 0 6px; font-weight: 700; }
      .value { font-size: 16px; margin: 0; }
      .msg { background:#f7f7ff; border-left: 4px solid #6b5bd6; padding: 14px; border-radius: 10px; margin-top: 8px; }
      a { color:#6b5bd6; text-decoration:none; }
      .footer { font-size: 12px; color:#888; margin-top: 18px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <p class="title">🌙 Nowa wiadomość z formularza</p>
        <p class="meta">Otrzymano: ${escapeHtml(new Date().toLocaleString("pl-PL"))}</p>

        <div class="label">Imię</div>
        <p class="value">${safeName}</p>

        <div class="label">Email</div>
        <p class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></p>

        <div class="label">Usługa</div>
        <p class="value">${safeService}</p>

        <div class="label">Wiadomość</div>
        <div class="msg">${safeMessage}</div>

        <div class="footer">
          System powiadomień • ${escapeHtml(process.env.SITE_URL || "")}
        </div>
      </div>
    </div>
  </body>
</html>`,
    });

    if (ownerEmail?.error) {
      throw new Error(`Owner email failed: ${ownerEmail.error.message}`);
    }
    if (!ownerEmail?.data?.id) {
      throw new Error("Owner email failed: no id returned from Resend");
    }

    // 2) Autoresponder do klienta
    const autoReply = await resend.emails.send({
      from,
      to: email,
      replyTo: ownerTo, // ważne: poprawia deliverability, pozwala odpisać do Ciebie
      subject: "Dziękuję za kontakt",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.8; color:#222; margin:0; padding:0; background:#f5f6fa; }
      .wrap { max-width: 640px; margin: 0 auto; padding: 20px; }
      .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 14px; padding: 26px; color: #fff; }
      .brand { font-size: 22px; font-weight: 800; margin: 0; }
      .card { background:#fff; border-radius: 14px; padding: 22px; margin-top: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
      .greet { font-size: 18px; font-weight: 700; color:#6b5bd6; margin: 0 0 12px; }
      .small { font-size: 13px; color:#666; margin-top: 16px; }
      .pill { display:inline-block; background:#f2ecff; color:#6b5bd6; padding: 8px 12px; border-radius: 999px; font-weight: 700; font-size: 13px; margin: 12px 0; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="hero">
        <p class="brand">🌙 Wróżka Samira</p>
        <div class="pill">Odpowiem w ciągu 24 godzin</div>
        <div>Twoja wiadomość dotarła bezpiecznie.</div>
      </div>

      <div class="card">
        <p class="greet">Witaj ${safeName}! ✨</p>

        <p>Dziękuję za kontakt i zainteresowanie usługą <strong>${safeService}</strong>.</p>
        <p>W międzyczasie możesz przygotować pytania, które chcesz zadać podczas konsultacji.</p>

        <p class="small">
          Podsumowanie:<br>
          Email: ${safeEmail}<br>
          Usługa: ${safeService}
        </p>
      </div>

      <div style="text-align:center; margin-top: 14px; color:#777; font-size:12px;">
        ${escapeHtml(process.env.SITE_URL || "")}
      </div>
    </div>
  </body>
</html>`,
    });

    if (autoReply?.error) {
      throw new Error(`Auto-reply failed: ${autoReply.error.message}`);
    }
    if (!autoReply?.data?.id) {
      throw new Error("Auto-reply failed: no id returned from Resend");
    }

    return res.status(200).json({
      success: true,
      message:
        "Email wysłany pomyślnie! Otrzymasz odpowiedź w ciągu 24 godzin. 🌙",
      data: {
        ownerEmailId: ownerEmail.data.id,
        autoReplyId: autoReply.data.id,
        totalSent: 2,
      },
    });
  } catch (error) {
    console.error("❌ ERROR SENDING EMAIL:", error?.message);

    return res.status(500).json({
      success: false,
      message:
        "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.",
      error: process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    availableEndpoints: ["GET /health", "POST /api/send-email"],
  });
});

/**
 * Vercel:
 * - w produkcji NIE odpalamy listen()
 * - eksportujemy app jako handler dla Serverless Function
 */
export default app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log("✅ Server running on:", `http://localhost:${PORT}`);
    console.log("🏥 Health check:", `http://localhost:${PORT}/health`);
    console.log("📧 Email endpoint:", `http://localhost:${PORT}/api/send-email`);
    console.log(
      "🔐 Resend API Key:",
      process.env.RESEND_API_KEY ? "✅ Configured" : "❌ Missing"
    );
    console.log(
      "📨 Owner Email:",
      process.env.OWNER_EMAIL || "❌ Missing OWNER_EMAIL"
    );
    console.log(
      "🌐 Allowed origins:",
      allowedOrigins.length ? allowedOrigins : "⚠️ none (CORS will block)"
    );
  });
}
