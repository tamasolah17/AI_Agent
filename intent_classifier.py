# intent_classifier.py
import json
import os
from openai import OpenAI
from memory import get_history, add_message

SYSTEM_PROMPT = """
You are an intent classification engine for a website AI agent.

Your task:
- Read the user message
- Choose exactly ONE intent from the allowed list
- Return valid JSON only

Allowed intents:
faq, pricing, booking, support, complaint, human, unknown

Rules:
- If the user asks for a meeting, demo, or call → booking
- If the user asks about cost or plans → pricing
- If the user is angry or dissatisfied → complaint
- If the intent is unclear → unknown
- Never invent new intents
- Never explain your reasoning

Output format:
{
  "intent": "<intent>",
  "confidence": 0.0-1.0
}
"""

ALLOWED_INTENTS = {
    "faq",
    "pricing",
    "booking",
    "support",
    "complaint",
    "human",
    "unknown"
}

def classify_intent(user_id: str, message: str) -> dict:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    history = get_history(user_id)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": message}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0
    )

    raw = response.choices[0].message.content.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {"intent": "unknown", "confidence": 0.0}

    # store user message in memory
    add_message(user_id, "user", message)

    return data
