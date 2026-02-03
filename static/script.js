const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");

function addMessage(content, role) {
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.textContent = content;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

function showLoading() {
    const div = document.createElement("div");
    div.className = "message assistant loading";
    div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    div.id = "loading-indicator";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.remove();
}

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    messageInput.value = "";
    messageInput.disabled = true;
    showLoading();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();

        if (data.error) {
            addMessage(`Error: ${data.error}`, "assistant");
        } else {
            addMessage(data.reply, "assistant");
        }
    } catch (err) {
        addMessage(`Error: ${err.message}`, "assistant");
    } finally {
        hideLoading();
        messageInput.disabled = false;
        messageInput.focus();
    }
});
