# AITeacher — Sun'iy Intellektni O'rganing

O'zbekistonning eng yaxshi AI ta'lim platformasi. Kosmik dizayn, amaliy kurslar va Groq AI mentor.

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| AI | Groq API (Llama 3.3 70B) |
| Auth | JWT Bearer Token |

## Boshlash

### 1. Repository klonlash

```bash
git clone <repo-url>
cd Aiteacher
```

### 2. Backend sozlash

```bash
cd backend
cp .env.example .env
```

`.env` faylini tahrirlang:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/aiteacher
SECRET_KEY=your-super-secret-key-min-32-chars
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx   # console.groq.com dan oling
FRONTEND_URL=http://localhost:3000
```

```bash
pip install -r requirements.txt
```

### 3. PostgreSQL

```bash
# PostgreSQL ishga tushiring
createdb aiteacher

# Jadvallarni yaratish (avtomatik - serverni ishga tushirish bilan)
python -m uvicorn app.main:app --reload

# Ma'lumotlar bilan to'ldirish
python seed.py
```

### 4. Frontend sozlash

```bash
cd frontend
cp src/app/.env.local.example .env.local
npm install
npm run dev
```

### 5. Docker bilan (eng oson)

```bash
# .env faylni yarating
cp backend/.env.example backend/.env
# GROQ_API_KEY ni kiriting

docker-compose up -d
docker-compose exec backend python seed.py
```

## Havolalar

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Demo hisob

```
Email: admin@aiteacher.uz
Parol: admin123
```

## Groq API kaliti olish

1. [console.groq.com](https://console.groq.com) ga kiring
2. "API Keys" → "Create API Key"
3. `.env` faylga yozing: `GROQ_API_KEY=gsk_...`

## Loyiha tuzilmasi

```
Aiteacher/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── database.py     # PostgreSQL ulanish
│   │   ├── config.py       # Sozlamalar
│   │   ├── models/         # SQLAlchemy modellari
│   │   ├── schemas/        # Pydantic schemalar
│   │   ├── routers/        # API endpointlar
│   │   └── services/       # Biznes logika (Groq, Auth)
│   ├── seed.py             # Demo ma'lumotlar
│   └── requirements.txt
│
├── frontend/               # Next.js frontend
│   └── src/
│       ├── app/            # Next.js App Router sahifalar
│       │   ├── page.tsx    # Landing sahifa
│       │   ├── courses/    # Kurslar
│       │   ├── chat/       # AI Chat
│       │   ├── dashboard/  # Foydalanuvchi panel
│       │   └── auth/       # Login/Register
│       ├── components/     # Qayta ishlatiladigan komponentlar
│       ├── lib/            # API client, Zustand store
│       └── types/          # TypeScript turlar
│
└── docker-compose.yml
```

## API Endpointlar

### Auth
- `POST /api/auth/register` — Ro'yxatdan o'tish
- `POST /api/auth/login` — Kirish
- `GET /api/auth/me` — Joriy foydalanuvchi

### Kurslar
- `GET /api/courses/` — Barcha kurslar
- `GET /api/courses/{slug}` — Kurs ma'lumoti
- `POST /api/courses/{id}/enroll` — Kursga yozilish
- `GET /api/courses/my/enrollments` — Mening kurslarim
- `POST /api/courses/lessons/progress` — Darsni tugatish

### AI Chat
- `GET /api/chat/sessions` — Suhbatlar ro'yxati
- `POST /api/chat/sessions` — Yangi suhbat
- `POST /api/chat/send` — Xabar yuborish
- `DELETE /api/chat/sessions/{id}` — Suhbatni o'chirish

### Foydalanuvchilar
- `GET /api/users/me/stats` — Statistika
- `PUT /api/users/me` — Profil yangilash
- `GET /api/users/leaderboard` — Reyting
