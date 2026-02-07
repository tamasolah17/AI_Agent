from flask import Flask, request, jsonify, render_template
from agent import handle_message

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    result = handle_message(
        user_id=data["user_id"],
        message=data["message"]
    )
    return jsonify(result)

@app.route("/")
def index():
    return render_template("widget.html")

if __name__ == "__main__":
    app.run(debug=True)
