const userId = localStorage.getItem("user_id") ||
               crypto.randomUUID();

localStorage.setItem("user_id", userId);

const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

input.addEventListener("keypress", async (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
        const userMessage = input.value;
        input.value = "";

        addMessage("You", userMessage);

        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                message: text
            })
        });

        const data = await response.json();
        addMessage("AI", data.reply);
    }
});

function addMessage(sender, text) {
    const div = document.createElement("div");
    div.textContent = `${sender}: ${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
