# 📅 Agenda IA

> Agenda personal con asistente de voz en español impulsado por IA. Hablás en lenguaje natural y el sistema crea, consulta y gestiona tus eventos automáticamente.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Koyeb](https://img.shields.io/badge/Backend-Koyeb-121212?logo=koyeb)

---

## 🟢 Demo en vivo → [agenda-ia-web.vercel.app](https://agenda-ia-web.vercel.app)

---


## ✨ ¿Qué hace?

- 🎙️ **Comandos de voz en español** — decís *"agendar reunión mañana a las 10"* y el evento se crea automáticamente.
- 🤖 **Pipeline de IA propio** — combina reglas con regex/keywords y un LLM (Groq / LLaMA 3.3 70B) para interpretar intents complejos o ambiguos.
- 🗓️ **Calendario interactivo** — vistas diaria, semanal y mensual con FullCalendar. CRUD completo desde la UI.
- 🔒 **Autenticación segura** — Firebase Auth con validación de JWT en cada request al backend.
- 💬 **Contexto conversacional** — si el asistente necesita más datos (ej: falta la hora), pregunta y guarda el estado hasta completar el evento.

---

## 🛠 Stack tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework principal |
| Vite | 8 | Bundler |
| TailwindCSS | 3 | Estilos |
| PrimeReact | 10 | Componentes UI |
| FullCalendar | 6 | Calendario interactivo |
| Firebase | 12 | Autenticación (email/password) |
| React Router | 7 | Rutas públicas y privadas |
| Axios | — | Llamadas HTTP a la API |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Spring Boot | 4 | Framework principal |
| Spring Data JPA | — | Acceso a base de datos |
| PostgreSQL | 16 | Base de datos |
| Groq API (LLaMA 3.3 70B) | — | Interpretación de intents con IA |
| Firebase Admin SDK | — | Verificación de tokens JWT |
| Lombok | — | Reducción de boilerplate |
| Docker | — | Containerización del backend |

---

## 🏗 Arquitectura del asistente de voz

```
Usuario habla / escribe
        ↓
Web Speech API (browser) / input de texto
        ↓
POST /voice?email=...  { text: "agendar reunión mañana a las 10" }
        ↓
InterpreterService
  ├── Reglas simples (regex + keywords)  →  IntentResult  ✅
  └── AIService (Groq / LLaMA 3.3 70B)  →  IntentResult  🤖
        ↓
VoiceController  →  switch(intent)
  ├── create_event  →  AgendaService.createEvent()
  ├── read_today    →  AgendaService.getTodayEvents()
  └── read_week     →  AgendaService.getWeekEvents()
        ↓
VoiceResponse { response: "Evento creado: Reunión · mañana 10:00 hs" }
        ↓
SpeechSynthesis API (browser) lee la respuesta en voz alta
```

> El `PendingIntentService` mantiene contexto de conversaciones incompletas en memoria, permitiendo diálogos de múltiples turnos para completar un evento.

---

## 🔌 API REST

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check |
| `POST` | `/users` | ❌ | Crear usuario |
| `GET` | `/users?email={email}` | ❌ | Obtener usuario por email |
| `GET` | `/events/{userId}` | 🔒 Firebase | Eventos del usuario |
| `POST` | `/events?email={email}` | 🔒 Firebase | Crear evento |
| `PUT` | `/events/{id}` | 🔒 Firebase | Editar evento |
| `DELETE` | `/events/{id}` | 🔒 Firebase | Eliminar evento |
| `POST` | `/voice?email={email}` | 🔒 Firebase | Procesar comando de voz / texto |

> Los endpoints 🔒 requieren el header `Authorization: Bearer <firebase-id-token>`.

---

## 🚀 Correr el proyecto localmente

### Backend

**Requisitos:** Java 21, Maven, PostgreSQL

```bash
# Compilar
mvn clean package -DskipTests

# Ejecutar
DB_URL=jdbc:postgresql://localhost:5432/agendaia \
DB_USER=postgres \
DB_PASSWORD=tu_password \
GROQ_API_KEY=gsk_... \
FIREBASE_SERVICE_ACCOUNT_JSON='{ ... }' \
java -jar target/*.jar
```

**O con Docker:**

```bash
docker build -t agendaia-backend .

docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host:5432/agendaia \
  -e DB_USER=postgres \
  -e DB_PASSWORD=... \
  -e GROQ_API_KEY=... \
  -e FIREBASE_SERVICE_ACCOUNT_JSON='...' \
  agendaia-backend
```

### Frontend

**Requisitos:** Node.js 20+

```bash
npm install
npm run dev
# Disponible en http://localhost:5173
```

### Variables de entorno — Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 📁 Estructura del proyecto

```
AgendaIA-Web/
├── src/
│   ├── Api/api.jsx                       # Llamadas HTTP con Axios + Firebase token
│   ├── Components/
│   │   ├── Eventlist.jsx                 # Calendario con FullCalendar (CRUD)
│   │   ├── VoiceAssistant.jsx            # Micrófono + TTS + input de texto
│   │   └── PushNotificationButton.jsx    # Activar recordatorios push
│   ├── Context/
│   │   └── AuthProvider.jsx              # Firebase onAuthStateChanged
│   ├── Hooks/
│   │   └── usePushNotifications.js       # Lógica de OneSignal
│   ├── Pages/
│   │   ├── Agenda.jsx
│   │   ├── Dashboard.jsx
│   │   └── auth/ (Login · Register)
│   └── Router/Router.jsx                 # Rutas públicas y privadas
│
└── [Backend repo separado → agusgioia/AgendaIA-Api]
    └── src/main/java/com/Agenda/IA/
        ├── Controllers/   (Agenda · User · Voice · Health)
        ├── Services/      (Agenda · Interpreter · AI · PendingIntent · ReminderScheduler)
        ├── Security/      (FirebaseAuthFilter)
        └── Config/        (Firebase · Security · GlobalExceptionHandler)
```

---

## 🔗 Repositorios relacionados

- **Frontend (este repo):** [agusgioia/AgendaIA-Web](https://github.com/agusgioia/AgendaIA-Web)
- **Backend:** [agusgioia/AgendaIA-Api](https://github.com/agusgioia/AgendaIA-Api)

