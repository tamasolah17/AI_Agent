from intent_classifier import classify_intent
from memory import add_message

def handle_message(user_id, message):
    result = classify_intent(user_id, message)

    intent = result["intent"]
    confidence = result["confidence"]

    if confidence < 0.6:
        intent = "unknown"

    if intent == "booking":
        reply = "Sure — I can help book a demo. What date works?"
    elif intent == "pricing":
        reply = "Our plans start at $49/month."
    elif intent == "complaint":
        reply = "I’m sorry about that. Can you tell me what went wrong?"
    elif intent == "human":
        reply = "I’ll connect you with a human agent."
    else:
        reply = "How can I help you today?"

    # store assistant reply in memory
    add_message(user_id, "assistant", reply)

    return {"reply": reply}
