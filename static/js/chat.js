// ==========================================
// NeuraChat AI - Chat JavaScript
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const micBtn = document.getElementById("micBtn");
const clearBtn = document.getElementById("clearBtn");
const newChatBtn = document.getElementById("newChatBtn");
const voiceBtn = document.getElementById("voiceBtn");

const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");
const removeImageBtn =
    document.getElementById("removeImageBtn");


// ==========================================
// SELECTED IMAGE
// ==========================================

let selectedImage = null;


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (imageInput) {

    imageInput.addEventListener("change", function () {

        const file = imageInput.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image.");

            imageInput.value = "";

            return;
        }

        selectedImage = file;

        const reader = new FileReader();

        reader.onload = function (event) {

            if (imagePreview) {
                imagePreview.src = event.target.result;
            }

            if (imagePreviewContainer) {
                imagePreviewContainer.style.display = "flex";
            }

        };

        reader.readAsDataURL(file);

    });

}


// ==========================================
// REMOVE IMAGE
// ==========================================

if (removeImageBtn) {

    removeImageBtn.addEventListener("click", function () {

        selectedImage = null;

        if (imageInput) {
            imageInput.value = "";
        }

        if (imagePreview) {
            imagePreview.src = "";
        }

        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = "none";
        }

    });

}


// ==========================================
// ADD MESSAGE TO CHAT
// ==========================================

function addMessage(sender, message, type) {

    const row = document.createElement("div");

    row.className = "message-row " + type + "-row";


    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message " + type + "-message";


    const name =
        document.createElement("div");

    name.className = "message-name";

    name.textContent =
        sender;


    const text =
        document.createElement("div");

    text.className = "message-text";

    text.textContent =
        message;


    const time =
        document.createElement("small");

    time.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    messageDiv.appendChild(name);
    messageDiv.appendChild(text);
    messageDiv.appendChild(time);

    row.appendChild(messageDiv);

    chatBox.appendChild(row);


    // Scroll to bottom

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const message =
        userInput.value.trim();


    // Check empty message and image

    if (!message && !selectedImage) {

        return;

    }


    // Display user message

    if (message) {

        addMessage(
            "👤 You",
            message,
            "user"
        );

    }


    // Display image in chat

    if (selectedImage) {

        const row =
            document.createElement("div");

        row.className =
            "message-row user-row";


        const messageDiv =
            document.createElement("div");

        messageDiv.className =
            "message user-message";


        const name =
            document.createElement("div");

        name.className =
            "message-name";

        name.textContent =
            "👤 You";


        const img =
            document.createElement("img");

        img.src =
            URL.createObjectURL(selectedImage);

        img.style.maxWidth =
            "250px";

        img.style.maxHeight =
            "250px";

        img.style.borderRadius =
            "10px";

        img.style.marginTop =
            "8px";


        messageDiv.appendChild(name);
        messageDiv.appendChild(img);

        row.appendChild(messageDiv);

        chatBox.appendChild(row);

    }


    // Save current image

    const imageToSend =
        selectedImage;


    // Clear input

    userInput.value = "";


    selectedImage = null;


    if (imageInput) {
        imageInput.value = "";
    }


    if (imagePreview) {
        imagePreview.src = "";
    }


    if (imagePreviewContainer) {
        imagePreviewContainer.style.display =
            "none";
    }


    // Typing message

    const typingRow =
        document.createElement("div");

    typingRow.className =
        "message-row bot-row";

    typingRow.id =
        "typingMessage";


    const typingDiv =
        document.createElement("div");

    typingDiv.className =
        "message bot-message";

    typingDiv.textContent =
        "🤖 NeuraChat AI is thinking...";


    typingRow.appendChild(typingDiv);

    chatBox.appendChild(typingRow);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        // ==================================
        // TEXT ONLY
        // ==================================

        if (!imageToSend) {

            const response =
                await fetch(
                    "/get_response",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message: message
                        })
                    }
                );


            const data =
                await response.json();


            removeTyping();


            if (data.response) {

                addMessage(
                    "🤖 NeuraChat AI",
                    data.response,
                    "bot"
                );

            } else {

                addMessage(
                    "🤖 NeuraChat AI",
                    "Sorry, I couldn't understand that.",
                    "bot"
                );

            }

        }


        // ==================================
        // IMAGE MESSAGE
        // ==================================

        else {

            const formData =
                new FormData();


            formData.append(
                "message",
                message
            );


            formData.append(
                "image",
                imageToSend
            );


            const response =
                await fetch(
                    "/get_response",
                    {
                        method: "POST",

                        body: formData
                    }
                );


            const data =
                await response.json();


            removeTyping();


            if (data.response) {

                addMessage(
                    "🤖 NeuraChat AI",
                    data.response,
                    "bot"
                );

            } else {

                addMessage(
                    "🤖 NeuraChat AI",
                    "I received the image, but I couldn't process it yet.",
                    "bot"
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Error:",
            error
        );


        removeTyping();


        addMessage(
            "🤖 NeuraChat AI",
            "⚠️ Server connection problem. Please try again.",
            "bot"
        );

    }

}


// ==========================================
// REMOVE TYPING MESSAGE
// ==========================================

function removeTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );


    if (typing) {

        typing.remove();

    }

}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}


// ==========================================
// ENTER KEY
// ==========================================

if (userInput) {

    userInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// ==========================================
// CLEAR CHAT
// ==========================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            chatBox.innerHTML = "";

            addMessage(
                "🤖 NeuraChat AI",
                "Chat cleared! How can I help you? 😊",
                "bot"
            );

        }
    );

}


// ==========================================
// NEW CHAT
// ==========================================

if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        function () {

            chatBox.innerHTML = "";

            addMessage(
                "🤖 NeuraChat AI",
                "New chat started! 😊",
                "bot"
            );

        }
    );

}


// ==========================================
// VOICE OUTPUT
// ==========================================

let voiceEnabled = true;


if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            voiceEnabled =
                !voiceEnabled;


            voiceBtn.textContent =
                voiceEnabled
                    ? "🔊"
                    : "🔇";

        }
    );

}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakText(text) {

    if (!voiceEnabled) {
        return;
    }


    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.lang =
        "en-US";


    window.speechSynthesis.speak(
        speech
    );

}


// ==========================================
// MICROPHONE
// ==========================================

if (micBtn) {

    micBtn.addEventListener(
        "click",
        function () {

            const SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;


            if (!SpeechRecognition) {

                alert(
                    "Voice input is not supported in this browser."
                );

                return;

            }


            const recognition =
                new SpeechRecognition();


            recognition.lang =
                "en-US";


            recognition.start();


            micBtn.textContent =
                "🔴";


            recognition.onresult =
                function (event) {

                    userInput.value =
                        event.results[0][0].transcript;

                };


            recognition.onend =
                function () {

                    micBtn.textContent =
                        "🎤";

                };


            recognition.onerror =
                function () {

                    micBtn.textContent =
                        "🎤";

                };

        }
    );

}
