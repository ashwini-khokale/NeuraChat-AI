const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const micBtn = document.getElementById("micBtn");

const clearBtn = document.getElementById("clearBtn");
const voiceBtn = document.getElementById("voiceBtn");
const newChatBtn = document.getElementById("newChatBtn");


// =========================
// CHAT HISTORY
// =========================

const savedChat =
    localStorage.getItem("neuraChatHistory");

if (savedChat) {
    chatBox.innerHTML = savedChat;
}


// =========================
// VOICE ON / OFF
// =========================

let voiceEnabled = true;


// =========================
// SAVE CHAT HISTORY
// =========================

function saveChatHistory() {

    localStorage.setItem(
        "neuraChatHistory",
        chatBox.innerHTML
    );

}


// =========================
// Current Time
// =========================

function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// =========================
// Add User Message
// =========================

function addUserMessage(message) {

    chatBox.innerHTML += `
        <div class="message-row user-row">

            <div class="message user-message">

                <div class="message-name">
                    👤 You
                </div>

                <div class="message-text">
                    ${message}
                </div>

                <small>
                    ${getCurrentTime()}
                </small>

            </div>

        </div>
    `;

    saveChatHistory();

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// =========================
// Add AI Message
// =========================

function addAIMessage(message) {

    chatBox.innerHTML += `
        <div class="message-row bot-row">

            <div class="message bot-message">

                <div class="message-name">
                    🤖 NeuraChat AI
                </div>

                <div class="message-text">
                    ${message}
                </div>

                <small>
                    ${getCurrentTime()}
                </small>

            </div>

        </div>
    `;

    saveChatHistory();

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// =========================
// Typing Animation
// =========================

function showTyping() {

    chatBox.innerHTML += `
        <div id="typing"
             class="message-row bot-row">

            <div class="message bot-message">

                <div class="message-name">
                    🤖 NeuraChat AI
                </div>

                <div class="typing-dots">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>
    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// =========================
// Remove Typing
// =========================

function removeTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }

}


// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    let message =
        userInput.value.trim();

    if (message === "") {
        return;
    }


    addUserMessage(message);

    userInput.value = "";

    showTyping();


    const status =
        document.querySelector(".status");

    if (status) {
        status.innerHTML =
            "🧠 Thinking...";
    }


    try {

        const response =
            await fetch("/get_response", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            });


        const data =
            await response.json();


        removeTyping();

        addAIMessage(
            data.response
        );


        // =========================
        // ERROR PROTECTION
        // =========================

        if (
            data.response.includes("Error") ||
            data.response.includes("429") ||
            data.response.includes(
                "RESOURCE_EXHAUSTED"
            ) ||
            data.response.includes("limit") ||
            data.response.includes(
                "technical problem"
            )
        ) {

            if (status) {
                status.innerHTML =
                    "🟢 Online";
            }

            return;
        }


        // =========================
        // VOICE OFF
        // =========================

        if (!voiceEnabled) {

            if (status) {
                status.innerHTML =
                    "🟢 Online";
            }

            return;
        }


        // =========================
        // AI VOICE
        // =========================

        const speech =
            new SpeechSynthesisUtterance(
                data.response
            );


        speech.lang = "en-US";

        speech.rate = 1.2;

        speech.pitch = 1;


        if (status) {
            status.innerHTML =
                "🔊 Speaking...";
        }


        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(
            speech
        );


        speech.onend =
            function() {

                if (status) {
                    status.innerHTML =
                        "🟢 Online";
                }

            };


    } catch (error) {

        removeTyping();

        addAIMessage(
            "⚠️ Server connection problem. Please try again."
        );


        if (status) {
            status.innerHTML =
                "🟢 Online";
        }

    }

}


// =========================
// SEND BUTTON
// =========================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// =========================
// ENTER KEY
// =========================

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }
);


// =========================
// NEW CHAT
// =========================

if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        function() {

            const confirmNewChat =
                confirm(
                    "Start a new chat? 💬"
                );


            if (!confirmNewChat) {
                return;
            }


            // Stop voice

            window.speechSynthesis.cancel();


            // Remove old history

            localStorage.removeItem(
                "neuraChatHistory"
            );


            // New chat

            chatBox.innerHTML = `
                <div class="message-row bot-row">

                    <div class="message bot-message">

                        <div class="message-name">
                            🤖 NeuraChat AI
                        </div>

                        <div class="message-text">
                            Hello! How can I help you? 😊
                        </div>

                        <small>
                            Just now
                        </small>

                    </div>

                </div>
            `;


            userInput.value = "";


            const status =
                document.querySelector(
                    ".status"
                );


            if (status) {
                status.innerHTML =
                    "🟢 Online";
            }

        }
    );

}


// =========================
// CLEAR CHAT
// =========================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function() {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear the chat? 🗑️"
                );


            if (!confirmClear) {
                return;
            }


            window.speechSynthesis.cancel();


            chatBox.innerHTML = `
                <div class="message-row bot-row">

                    <div class="message bot-message">

                        <div class="message-name">
                            🤖 NeuraChat AI
                        </div>

                        <div class="message-text">
                            Hello! How can I help you? 😊
                        </div>

                        <small>
                            Just now
                        </small>

                    </div>

                </div>
            `;


            localStorage.removeItem(
                "neuraChatHistory"
            );


            const status =
                document.querySelector(
                    ".status"
                );


            if (status) {
                status.innerHTML =
                    "🟢 Online";
            }

        }
    );

}


// =========================
// VOICE ON / OFF
// =========================

if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function() {

            if (voiceEnabled) {

                voiceEnabled = false;

                window.speechSynthesis.cancel();

                voiceBtn.innerHTML =
                    "🔇";

                voiceBtn.title =
                    "Voice Off";

            }

            else {

                voiceEnabled = true;

                voiceBtn.innerHTML =
                    "🔊";

                voiceBtn.title =
                    "Voice On";

            }

        }
    );

}


// =========================
// VOICE RECOGNITION
// =========================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;


    // =========================
    // MIC BUTTON
    // =========================

    micBtn.addEventListener(
        "click",
        function() {

            try {

                recognition.start();

                micBtn.innerHTML =
                    "🔴";

                micBtn.title =
                    "Listening...";

                micBtn.classList.add(
                    "listening"
                );


                const status =
                    document.querySelector(
                        ".status"
                    );


                if (status) {
                    status.innerHTML =
                        "🎤 Listening...";
                }


            } catch (error) {

                console.log(
                    "Recognition already started."
                );

            }

        }
    );


    // =========================
    // VOICE RESULT
    // =========================

    recognition.onresult =
        function(event) {

            let result =
                event.results[
                    event.results.length - 1
                ];


            if (result.isFinal) {

                const voiceText =
                    result[0].transcript;


                userInput.value =
                    voiceText;


                micBtn.innerHTML =
                    "🎤";

                micBtn.title =
                    "Speak";

                micBtn.classList.remove(
                    "listening"
                );


                sendMessage();

            }

        };


    // =========================
    // VOICE END
    // =========================

    recognition.onend =
        function() {

            micBtn.innerHTML =
                "🎤";

            micBtn.title =
                "Speak";

            micBtn.classList.remove(
                "listening"
            );


            const status =
                document.querySelector(
                    ".status"
                );


            if (
                status &&
                !window.speechSynthesis.speaking
            ) {

                status.innerHTML =
                    "🟢 Online";

            }

        };


    // =========================
    // VOICE ERROR
    // =========================

    recognition.onerror =
        function(event) {

            micBtn.innerHTML =
                "🎤";

            micBtn.title =
                "Speak";

            micBtn.classList.remove(
                "listening"
            );


            const status =
                document.querySelector(
                    ".status"
                );


            if (status) {
                status.innerHTML =
                    "🟢 Online";
            }


            console.log(
                "Voice Error:",
                event.error
            );

        };


} else {

    micBtn.disabled = true;

    micBtn.innerHTML =
        "❌";

}
