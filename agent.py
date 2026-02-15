from intent_classifier import classify_intent
from memory import add_message

def handle_message(user_id, message):
    result = classify_intent(user_id, message)

    intent = result["intent"]
    confidence = result["confidence"]

    if confidence < 0.6:
        intent = "unknown"

    if intent == "pricing_objection":
        return {
            "reply": "🤖Our plans start at $49/month.",
            "suggestions": [
                "Book a demo",
                "What features are included?",
                "Talk to a human"
            ]
        }
    elif intent == "welcome_message":

        reply = (
            "Hi 👋 I can help you with pricing, features or ordering."
        )
    elif intent == "trust_objection":
        reply = (
            "Totally fair question. We offer a 1-year warranty and a hassle-free refund. "
            "Many customers were unsure at first but were surprised by the quality. "
            "What’s your main concern?"
        )

    elif intent == "shipping_objection":
        reply = (
            "Shipping usually takes 5–7 business days, and you’ll get tracking updates. "
            "Would you like me to walk you through the delivery process?"
        )

    elif intent == "refund_objection":
        reply = (
            "If it doesn’t work for you, you can return it within 30 days — no questions asked. "
            "That’s why most people feel comfortable trying it."
        )

    elif intent == "product_fit_question":
        reply = (
            "Happy to help with that. Can you tell me what problem you’re hoping this solves?"
        )
    elif intent == "Mask_declaration":
        reply = (
            "Our brand new Relaxify Anti Aging Mask is the perfect option, if you strugling with acnes, insomnia or inflammations"
        )

    elif intent == "checkout_intent":
        reply = (
            "Great choice 👍 You can complete your order securely on the checkout page. "
            "Let me know if you need help with anything before you finish."
        )

    elif intent == "human":
        reply = (
            "No problem — I can connect you with a human assistant. "
            "Would you like to leave your email?"
        )

    else:
        reply = (
            "I’m here to help if you have any questions about the product, shipping, or warranty."
        )

    add_message(user_id, "assistant", reply)

    return {"reply": reply}
