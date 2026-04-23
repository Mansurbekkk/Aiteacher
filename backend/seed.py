"""Seed database with initial course data"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.course import Course, Lesson, DifficultyLevel
from app.services.auth_service import get_password_hash

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed_courses():
    courses_data = [
        {
            "title": "AI ga Kirish",
            "slug": "ai-ga-kirish",
            "description": "Sun'iy intellektning asosiy tushunchalari, tarixi va bugungi kunda qo'llanilishi. Ushbu kurs AI dunyasiga birinchi qadam sifatida mo'ljallangan.",
            "short_description": "AI asoslari va tarixi bilan tanishing",
            "difficulty": DifficultyLevel.BEGINNER,
            "duration_hours": 3.5,
            "is_free": True,
            "is_published": True,
            "order_index": 1,
            "icon": "🤖",
            "color_from": "#9333EA",
            "color_to": "#06B6D4",
            "lessons": [
                {
                    "title": "Sun'iy intellekt nima?",
                    "content": """# Sun'iy Intellekt Nima?

**Sun'iy intellekt (AI)** – bu kompyuter tizimlarining inson aqlini taqlid qilish qobiliyati.

## AI ning asosiy turlari:

### 1. Tor AI (Narrow AI)
- Faqat bitta vazifani bajaradi
- Masalan: Chess o'ynash, yuz tanish, tarjima

### 2. Umumiy AI (General AI)
- Inson kabi har qanday vazifani bajara oladi
- Hali to'liq ishlab chiqilmagan

### 3. Super AI
- Inson intellektidan oshib ketadi
- Kelajak texnologiyasi

## AI qanday ishlaydi?

```python
# Oddiy AI misoli - qaror qabul qilish
def ai_decision(temperature):
    if temperature > 30:
        return "Sovuq ich 🧊"
    elif temperature > 20:
        return "Normal kun 🌤️"
    else:
        return "Issiq kiyim kiy 🧥"

result = ai_decision(25)
print(result)  # Normal kun 🌤️
```

## AI tarixi:
- **1956** – AI atamasi kiritildi (John McCarthy)
- **1997** – Deep Blue shaxmatda insonni yutdi
- **2012** – Deep Learning inqilobi
- **2022** – ChatGPT millionlab foydalanuvchi
- **2024** – Multimodal AI davri

## Xulosa
AI – bu kelajak emas, bu bugungi kunning texnologiyasi. Uni o'rganish orqali katta imkoniyatlarga ega bo'lasiz!
""",
                    "order_index": 1,
                    "duration_minutes": 15,
                    "xp_reward": 50,
                    "has_quiz": True,
                },
                {
                    "title": "Machine Learning asoslari",
                    "content": """# Machine Learning Asoslari

**Machine Learning (ML)** – bu AI ning bir turi bo'lib, kompyuter ma'lumotlardan o'rganadi.

## ML qanday ishlaydi?

### Oddiy tushuntirish:
Siz bolaga "bu it, bu mushuk" deb ko'p rasm ko'rsatsangiz, bola o'zi o'rganadi. ML ham xuddi shunday ishlaydi!

## ML ning 3 turi:

### 1. Supervised Learning (Nazoratli o'rganish)
```python
# Email spam filtri misoli
emails = [
    ("Siz 1 million dollar yutdingiz!", "spam"),
    ("Holat yig'ilishi ertaga", "normal"),
    ("BEPUL SOVG'A OLING!!!", "spam"),
]

# Model bu ma'lumotlardan o'rganadi
model.train(emails)

# Yangi emailni tekshirish
result = model.predict("Siz tanlangan g'olibsiz!")
print(result)  # spam
```

### 2. Unsupervised Learning (Nazorat qilinmagan)
- Ma'lumotlarni o'zi guruhlaydi
- Masalan: Mijozlarni segmentlash

### 3. Reinforcement Learning (Mukofot asosida)
- Xato-to'g'ri orqali o'rganadi
- Masalan: O'yin o'ynash, robot harakati

## Mashhur ML algoritmlari:
| Algoritm | Qo'llanish |
|----------|-----------|
| Linear Regression | Narx bashorati |
| Decision Tree | Qaror qabul qilish |
| Neural Networks | Murakkab vazifalar |
| K-Means | Guruhlash |

## Python bilan ML:
```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Uy narxi bashorati
X = np.array([[50], [100], [150], [200]])  # m²
y = np.array([50000, 100000, 150000, 200000])  # narx

model = LinearRegression()
model.fit(X, y)

# 120 m² uy narxi nechchi?
bashorat = model.predict([[120]])
print(f"Taxminiy narx: {bashorat[0]:,.0f} so'm")
```
""",
                    "order_index": 2,
                    "duration_minutes": 25,
                    "xp_reward": 75,
                    "has_quiz": True,
                },
                {
                    "title": "Neural Networks va Deep Learning",
                    "content": """# Neural Networks va Deep Learning

## Neyron tarmoq nima?

Inson miyasidagi neyronlardan ilhom olingan kompyuter modeli.

```
Input → [Hidden Layers] → Output
  |          |               |
 Ma'lumot  O'rganish    Natija
```

## Oddiy Python misoli:

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# 1 ta neyron
def neuron(inputs, weights, bias):
    z = np.dot(inputs, weights) + bias
    return sigmoid(z)

inputs = [0.5, 0.3, 0.8]
weights = [0.4, 0.6, 0.2]
bias = -0.1

output = neuron(inputs, weights, bias)
print(f"Neyron chiqishi: {output:.4f}")
```

## Deep Learning qo'llanilishi:

- 🖼️ **Rasm tanish** – Yuz ID, tibbiy tashxis
- 🗣️ **Nutq tanish** – Siri, Alexa, Google Assistant
- 📝 **Matn yaratish** – ChatGPT, Claude
- 🎵 **Musiqa yaratish** – Suno, Udio
- 🎬 **Video yaratish** – Sora, Runway

## PyTorch bilan oddiy model:

```python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),  # Input
            nn.ReLU(),
            nn.Linear(128, 64),   # Hidden
            nn.ReLU(),
            nn.Linear(64, 10)     # Output (10 ta raqam)
        )

    def forward(self, x):
        return self.layers(x)

model = SimpleNet()
print(model)
```
""",
                    "order_index": 3,
                    "duration_minutes": 30,
                    "xp_reward": 100,
                    "has_quiz": True,
                },
            ]
        },
        {
            "title": "Prompt Engineering",
            "slug": "prompt-engineering",
            "description": "AI modellaridan maksimal natija olish uchun samarali promptlar yozish san'ati. ChatGPT, Claude va boshqa modellar bilan professional ishlash.",
            "short_description": "AI'dan professional foydalanish san'ati",
            "difficulty": DifficultyLevel.BEGINNER,
            "duration_hours": 4,
            "is_free": True,
            "is_published": True,
            "order_index": 2,
            "icon": "✍️",
            "color_from": "#F59E0B",
            "color_to": "#EF4444",
            "lessons": [
                {
                    "title": "Prompt nima va nima uchun muhim?",
                    "content": """# Prompt Engineering

## Prompt nima?

**Prompt** – bu AI ga beriladigan ko'rsatma yoki savol.

## Yaxshi vs Yomon Prompt:

### ❌ Yomon prompt:
```
"Kod yoz"
```
AI nima yozishini bilmaydi!

### ✅ Yaxshi prompt:
```
"Python tilida foydalanuvchidan ism so'rab,
'Salom, [ism]! Xush kelibsiz!' deb chiqaruvchi
kod yoz. Kodni tushuntiruvchi izohlar qo'sh."
```

## Prompt tuzilishi:

```
[Rol] + [Vazifa] + [Kontekst] + [Format] + [Cheklov]
```

### Misol:
```
Sen tajribali Python dasturchi sisan. [Rol]

Menga to-do list ilovasi uchun kod yoz. [Vazifa]

Ilova: foydalanuvchi vazifalar qo'sha oladi,
ko'ra oladi va o'chira oladi. [Kontekst]

Kod tozalay bo'lsin, funksiyalarga ajratilgan,
izohlar bilan. [Format]

Tashqi kutubxonalar ishlatma. [Cheklov]
```

## 5 ta asosiy texnika:

### 1. Zero-shot
```
"Python'da palindrom tekshiruvchi funksiya yoz"
```

### 2. Few-shot (misollar bilan)
```
"Quyidagi misollar asosida sentiment aniqlat:
Misol 1: 'Ajoyib mahsulot!' → Ijobiy
Misol 2: 'Umuman yoqmadi' → Salbiy
Misol 3: 'Oddiy, na yaxshi na yomon' → Neytral

Tekshir: 'Juda qoniqarli xizmat!'"
```

### 3. Chain-of-Thought
```
"Qadam-baqadam tushuntir:
17 × 24 = ?
Avval o'nlar, keyin birliklar..."
```
""",
                    "order_index": 1,
                    "duration_minutes": 20,
                    "xp_reward": 60,
                    "has_quiz": True,
                },
                {
                    "title": "Advanced Prompt Texnikalar",
                    "content": """# Advanced Prompt Texnikalar

## 1. Role Prompting

```
"Sen 10 yillik tajribaga ega cybersecurity ekspertisan.
Mening web ilovamning xavfsizligini audit qil va
zaifliklarni aniqlat."
```

## 2. Structured Output

```
"Quyidagi ma'lumotni JSON formatda qaytar:
- name: to'liq ism
- skills: ko'nikmalar ro'yxati
- level: beginner/intermediate/advanced

Ma'lumot: 'Alisher 3 yildan beri Python va
FastAPI bilan ishlamoqda. Hozir ML o'rganmoqda.'"
```

Natija:
```json
{
  "name": "Alisher",
  "skills": ["Python", "FastAPI", "Machine Learning"],
  "level": "intermediate"
}
```

## 3. Constraints (Cheklovlar)

```
"Quyidagi shartlar bilan maqola yoz:
✅ 300-400 so'z
✅ O'zbek tilida
✅ 3 ta bo'lim bo'lsin
✅ Har bo'limda amaliy misol
❌ Murakkab texnik atamalar ishlatma
❌ Inglizcha so'zlarni izohlama"
```

## 4. Iterative Refinement

```
1-qadam: "Veb-sayt yaratish haqida maqola yoz"
2-qadam: "Uni yanada qiziqarliroq qil, misollar qo'sh"
3-qadam: "Boshlang'ich dasturchilar uchun moslash"
4-qadam: "Xulosa qismini kuchaytir"
```

## 5. System + User Prompts (API uchun)

```python
import groq

client = groq.Groq()

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": "Sen o'zbek tilida javob beruvchi dasturlash o'qituvchisisisan."
        },
        {
            "role": "user",
            "content": "Python'da list comprehension nima?"
        }
    ]
)
print(response.choices[0].message.content)
```

## Eng yaxshi amaliyotlar:
1. Aniq va lo'nda bo'l
2. Kontekst ber
3. Misol ko'rsat
4. Formatni belgilat
5. Iteratsiya qil
""",
                    "order_index": 2,
                    "duration_minutes": 30,
                    "xp_reward": 80,
                    "has_quiz": True,
                },
            ]
        },
        {
            "title": "Groq API bilan ishlash",
            "slug": "groq-api-bilan-ishlash",
            "description": "Groq API orqali tezkor LLM modellaridan foydalanish. Real ilovalar yaratish, streaming, function calling va ko'p qo'llanilishlar.",
            "short_description": "Groq API - eng tezkor LLM platformasi",
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "duration_hours": 5,
            "is_free": True,
            "is_published": True,
            "order_index": 3,
            "icon": "⚡",
            "color_from": "#10B981",
            "color_to": "#06B6D4",
            "lessons": [
                {
                    "title": "Groq API bilan tanishish",
                    "content": """# Groq API

## Groq nima?

**Groq** – dunyodagi eng tez LLM inference platformasi.

### Tezlik solishtirmasi:
| Platforma | Tezlik |
|-----------|--------|
| Groq | ~500 tokens/sec ⚡ |
| OpenAI | ~50 tokens/sec |
| Boshqalar | ~30-80 tokens/sec |

## Groq API boshlash:

### 1. O'rnatish
```bash
pip install groq
```

### 2. API kalitini olish
- console.groq.com ga kiring
- "Create API Key" tugmasini bosing
- Kalitni .env fayliga saqlang

### 3. Birinchi so'rov:
```python
from groq import Groq

client = Groq(api_key="gsk_...")

completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": "Salom! Sen kimsan?"
        }
    ],
    temperature=0.7,
    max_tokens=1024,
)

print(completion.choices[0].message.content)
```

## Mavjud modellar:

```python
# Eng yaxshi modellar
models = {
    "llama-3.3-70b-versatile": "Eng kuchli, universial",
    "llama-3.1-8b-instant":    "Eng tez, yengil vazifalar",
    "mixtral-8x7b-32768":      "Katta kontekst (32k token)",
    "gemma2-9b-it":            "Google modeli",
}
```

## Parametrlar:
```python
completion = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=messages,
    temperature=0.7,      # 0=aniq, 1=ijodiy
    max_tokens=2048,      # Maksimal javob uzunligi
    top_p=0.9,            # Diversity
    stream=False,         # Streaming rejimi
)
```
""",
                    "order_index": 1,
                    "duration_minutes": 20,
                    "xp_reward": 75,
                    "has_quiz": True,
                },
                {
                    "title": "Streaming va amaliy ilovalar",
                    "content": """# Groq Streaming va Ilovalar

## Streaming (Real-time javob):

```python
from groq import Groq

client = Groq(api_key="your-key")

# Streaming yoqilgan
stream = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Python haqida 5 fakt ayt"}],
    stream=True,  # Streaming!
)

# Real-time chiqarish
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # Yangi qator
```

## FastAPI + Groq (Streaming endpoint):

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from groq import Groq

app = FastAPI()
client = Groq(api_key="your-key")

@app.get("/stream")
async def stream_chat(message: str):
    def generate():
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": message}],
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return StreamingResponse(generate(), media_type="text/plain")
```

## Amaliy misol: AI Chatbot

```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def chatbot():
    print("AI Chatbot (chiqish uchun 'exit' yozing)")
    history = []

    while True:
        user_input = input("\\nSiz: ").strip()
        if user_input.lower() == "exit":
            break

        history.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Sen yordamchi AI assistantsisan."},
                *history
            ],
            max_tokens=1024,
        )

        ai_response = response.choices[0].message.content
        history.append({"role": "assistant", "content": ai_response})
        print(f"\\nAI: {ai_response}")

chatbot()
```

## Tokens va narxlar:

```python
# Token hisoblash
response = client.chat.completions.create(...)

print(f"So'rov tokenlari: {response.usage.prompt_tokens}")
print(f"Javob tokenlari: {response.usage.completion_tokens}")
print(f"Jami: {response.usage.total_tokens}")

# Groq narxlari juda arzon:
# llama-3.3-70b: $0.59/M input, $0.79/M output
```
""",
                    "order_index": 2,
                    "duration_minutes": 35,
                    "xp_reward": 100,
                    "has_quiz": True,
                },
            ]
        },
        {
            "title": "Python bilan AI loyiha",
            "slug": "python-ai-loyiha",
            "description": "Python va Groq API yordamida real AI loyihalar yaratish. Chatbot, matn tahlili, kod generator va boshqa amaliy ilovalar.",
            "short_description": "Amaliy AI loyihalar yaratish",
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "duration_hours": 8,
            "is_free": True,
            "is_published": True,
            "order_index": 4,
            "icon": "🚀",
            "color_from": "#EF4444",
            "color_to": "#9333EA",
            "lessons": [
                {
                    "title": "AI Chatbot yaratish",
                    "content": """# To'liq AI Chatbot Yaratish

## Loyiha tuzilmasi:

```
chatbot/
├── main.py          # Asosiy fayl
├── config.py        # Sozlamalar
├── chat.py          # Chat logikasi
├── .env             # API kalitlar
└── requirements.txt
```

## requirements.txt:
```
groq
python-dotenv
rich  # Chiroyli terminal
```

## config.py:
```python
from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
MAX_TOKENS = 2048
TEMPERATURE = 0.7
SYSTEM_PROMPT = \"\"\"Sen O'zbekiston haqida ma'lumot beruvchi
AI assistantsisan. Faqat o'zbek tilida javob ber.
Aniq, qisqa va foydali ma'lumotlar ber.\"\"\"
```

## chat.py:
```python
from groq import Groq
from config import GROQ_API_KEY, MODEL, MAX_TOKENS, TEMPERATURE, SYSTEM_PROMPT

class AIChat:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.history = []

    def send(self, message: str) -> str:
        self.history.append({
            "role": "user",
            "content": message
        })

        response = self.client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *self.history[-20:]  # Oxirgi 20 xabar
            ],
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )

        ai_message = response.choices[0].message.content
        self.history.append({
            "role": "assistant",
            "content": ai_message
        })

        return ai_message

    def clear_history(self):
        self.history = []
        print("Suhbat tozalandi!")
```

## main.py (Rich bilan):
```python
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from chat import AIChat

console = Console()
chat = AIChat()

console.print(Panel(
    "[bold cyan]AITeacher Chatbot[/bold cyan]\\n"
    "Savol bering, AI javob beradi!\\n"
    "[dim]Buyruqlar: /clear - tozalash, /exit - chiqish[/dim]",
    border_style="purple"
))

while True:
    try:
        user_input = console.input("[bold green]Siz:[/bold green] ").strip()

        if not user_input:
            continue
        if user_input == "/exit":
            break
        if user_input == "/clear":
            chat.clear_history()
            continue

        with console.status("[bold yellow]Javob kutilmoqda...[/bold yellow]"):
            response = chat.send(user_input)

        console.print(Panel(
            Markdown(response),
            title="[bold blue]AI[/bold blue]",
            border_style="blue"
        ))

    except KeyboardInterrupt:
        break

console.print("[bold red]Xayr![/bold red]")
```
""",
                    "order_index": 1,
                    "duration_minutes": 40,
                    "xp_reward": 120,
                    "has_quiz": False,
                },
            ]
        },
    ]

    for course_data in courses_data:
        lessons_data = course_data.pop("lessons", [])

        existing = db.query(Course).filter(Course.slug == course_data["slug"]).first()
        if existing:
            print(f"Kurs mavjud: {course_data['title']}")
            continue

        course = Course(**course_data)
        db.add(course)
        db.flush()

        for lesson_data in lessons_data:
            lesson = Lesson(course_id=course.id, **lesson_data)
            db.add(lesson)

        print(f"✅ Kurs yaratildi: {course_data['title']}")

    db.commit()


def seed_admin():
    existing = db.query(User).filter(User.email == "admin@aiteacher.uz").first()
    if existing:
        print("Admin mavjud")
        return

    admin = User(
        email="admin@aiteacher.uz",
        username="admin",
        full_name="AI Teacher Admin",
        hashed_password=get_password_hash("admin123"),
        is_admin=True,
        xp_points=10000,
        level=8,
    )
    db.add(admin)
    db.commit()
    print("✅ Admin yaratildi: admin@aiteacher.uz / admin123")


if __name__ == "__main__":
    print("🌱 Ma'lumotlar bazasi to'ldirilmoqda...")
    seed_admin()
    seed_courses()
    print("✅ Tayyor!")
    db.close()
