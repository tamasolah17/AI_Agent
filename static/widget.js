window.addEventListener("DOMContentLoaded", function () {

    // Create floating button
    const button = document.createElement("div");
    button.innerHTML = "💬";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.background = "#007bff";

    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.borderRadius = "50%";
    button.style.cursor = "pointer";
    button.style.color = "#007bff";

    button.style.zIndex = "9999";
    document.body.appendChild(button);

    // Create chat box
    const chatBox = document.createElement("div");
    chatBox.style.position = "fixed";
    chatBox.style.bottom = "90px";
    chatBox.style.right = "20px";
    chatBox.style.width = "320px";
    chatBox.style.height = "420px";
    chatBox.style.background = "white";
    chatBox.style.borderRadius = "12px";
    chatBox.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
    chatBox.style.display = "none";
    chatBox.style.flexDirection = "column";
    chatBox.style.overflow = "hidden";
    chatBox.style.zIndex = "9999";
    chatBox.style.display = "none";
    chatBox.style.display = "flex";
    chatBox.style.visibility = "hidden";

    document.body.appendChild(chatBox);

    // HEADER
    const header = document.createElement("div");
    header.innerText = " 🤖AI Assistant";
    header.style.background = "#007bff";
    header.style.color = "white";
    header.style.padding = "12px";
    header.style.fontWeight = "bold";
    chatBox.appendChild(header);

    // MESSAGES
    const messages = document.createElement("div");
    messages.style.flex = "1";
    messages.style.padding = "10px";
    messages.style.overflowY = "auto";
    chatBox.appendChild(messages);

    // INPUT AREA
    const inputArea = document.createElement("div");
    inputArea.style.display = "flex";
    inputArea.style.borderTop = "1px solid #ddd";

    const input = document.createElement("input");
    input.placeholder = "Type a message...";
    input.style.flex = "1";
    input.style.padding = "10px";
    input.style.border = "none";
    input.style.outline = "none";
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });


    const sendBtn = document.createElement("button");
    sendBtn.innerText = "Send";
    sendBtn.style.background = "#007bff";
    sendBtn.style.color = "white";
    sendBtn.style.border = "none";
    sendBtn.style.padding = "10px 15px";
    sendBtn.style.cursor = "pointer";

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    chatBox.appendChild(inputArea);



    let welcomeLoaded = false;

    button.addEventListener("click", async function () {

        const opening = chatBox.style.visibility === "hidden";

        if (opening) {
            chatBox.style.visibility = "visible";

            if (!welcomeLoaded) {
                welcomeLoaded = true;

                const res = await fetch("/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: "demo_user",
                        message: ""
                    })
                });

                const data = await res.json();

                const botMsg = document.createElement("div");
                botMsg.innerText = data.reply || "No response.";
                botMsg.style.margin = "8px 0";
                botMsg.style.padding = "8px 12px";
                botMsg.style.borderRadius = "16px";
                botMsg.style.background = "#e5e5ea";
                botMsg.style.color = "black";
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;

            }

        } else {
            chatBox.style.visibility = "hidden";
        }
    });

    function showTyping() {
        typingBubble = document.createElement("div");
        typingBubble.innerText = "AI is typing...";
        typingBubble.style.margin = "8px 0";
        typingBubble.style.padding = "8px 12px";
        typingBubble.style.borderRadius = "16px";
        typingBubble.style.background = "#e5e5ea";
        typingBubble.style.fontStyle = "italic";
        typingBubble.style.opacity = "0.7";
        messages.appendChild(typingBubble);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        if (typingBubble) {
            typingBubble.remove();
            typingBubble = null;
        }
    }

    function showSuggestions(items) {
        const wrapper = document.createElement("div");
        wrapper.style.marginTop = "8px";
        wrapper.style.display = "flex";
        wrapper.style.flexWrap = "wrap";
        wrapper.style.gap = "6px";

        items.forEach(text => {
            const btn = document.createElement("button");
            btn.innerText = text;
            btn.style.padding = "6px 10px";
            btn.style.borderRadius = "14px";
            btn.style.border = "1px solid black";
            btn.style.background = "white";
            btn.style.color = " black";


            btn.style.cursor = "pointer";

            btn.onclick = () => {
                input.value = text;
                sendMessage();
            };

            wrapper.appendChild(btn);
        });

        messages.appendChild(wrapper);
        messages.scrollTop = messages.scrollHeight;
    }

    // Send message
    async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement("div");
    userMsg.innerText = text;
    userMsg.style.margin = "8px 0";
    userMsg.style.padding = "8px 12px";
    userMsg.style.borderRadius = "16px";
    userMsg.style.background = "#007bff";
    userMsg.style.color = "white";
    userMsg.style.alignSelf = "flex-end";
    messages.appendChild(userMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    showTyping();

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: "demo_user",
                message: text
            })
        });

        const data = await res.json();

        removeTyping();

        const botMsg = document.createElement("div");
        botMsg.innerText = data.reply || "No response.";
        botMsg.style.margin = "8px 0";
        botMsg.style.padding = "8px 12px";
        botMsg.style.borderRadius = "16px";
        botMsg.style.background = "#e5e5ea";
        botMsg.style.color = "black";
        messages.appendChild(botMsg);

        if (data.suggestions && data.suggestions.length > 0) {
            showSuggestions(data.suggestions);
        }

        messages.scrollTop = messages.scrollHeight;

    } catch (err) {
        removeTyping();
        console.error(err);
    }
}
});

