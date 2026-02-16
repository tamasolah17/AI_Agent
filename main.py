from flask import Flask, request, jsonify, render_template
from agent import handle_message

app2 = Flask(__name__)

@app2.route("/chat", methods=["POST"])  
def chat():
    data = request.json
    message = data.get("message", "").strip()
    user_id = data["user_id"]
    if message == "":
        return jsonify({
            "intent": "welcome_message",
            "confidence": 1.0,
            "reply": "Hi 👋 I can help you with pricing, delivery or choosing the product."
        })
    result = handle_message(
        user_id=data["user_id"],
        message=data["message"]

    )
    return jsonify(result)

@app2.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app2.run(debug=True)
