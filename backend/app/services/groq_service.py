from groq import Groq
from app.config import settings
from typing import List, Dict

client = Groq(api_key=settings.GROQ_API_KEY)

AI_SYSTEM_PROMPT = """Sen "AITeacher" nomli sun'iy intellekt o'qituvchisisisan.
Sen foydalanuvchilarga sun'iy intellekt, machine learning, deep learning,
prompt engineering va dasturlash haqida o'rgatasan.

Qoidalar:
- Har doim o'zbek tilida javob ber (agar foydalanuvchi boshqa tilda yozmasa)
- Misollar keltir va oddiy tilda tushuntir
- Kodni tushuntirish uchun kod bloklari ishlet
- Har bir javob oxirida kichik savol ber yoki keyingi o'rganish uchun maslahat ber
- Iliqlik va qo'llab-quvvatlash ko'rsatuvchi ton saqlat
- Xatolarni tahlil qilishga yordam ber

Mavzular:
✅ Sun'iy intellekt (AI) asoslari
✅ Machine Learning
✅ Deep Learning / Neural Networks
✅ Prompt Engineering
✅ Python dasturlash
✅ Groq, OpenAI, Anthropic API'lari
✅ LangChain va AI frameworklar
✅ AI loyihalar yaratish"""


def chat_with_ai(messages: List[Dict], user_message: str) -> str:
    all_messages = [{"role": "system", "content": AI_SYSTEM_PROMPT}]
    all_messages.extend(messages[-20:])  # Last 20 messages for context
    all_messages.append({"role": "user", "content": user_message})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=all_messages,
        temperature=0.7,
        max_tokens=2048,
    )
    return completion.choices[0].message.content


def explain_concept(concept: str) -> str:
    messages = [
        {"role": "system", "content": AI_SYSTEM_PROMPT},
        {"role": "user", "content": f"Menga '{concept}' haqida batafsil tushuntirib ber. Misollar keltir."}
    ]
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.6,
        max_tokens=1500,
    )
    return completion.choices[0].message.content


def generate_quiz(topic: str) -> str:
    messages = [
        {"role": "system", "content": "Sen AI o'qituvchisisisan. Test savollari yarat."},
        {"role": "user", "content": f"""'{topic}' mavzusida 3 ta test savoli yarat.
        JSON formatda qaytar:
        {{"questions": [{{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}}]}}
        """}
    ]
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.5,
        max_tokens=1000,
    )
    return completion.choices[0].message.content
