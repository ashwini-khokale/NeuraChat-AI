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

const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");

const pdfBtn = document.getElementById("pdfBtn");
const pdfInput = document.getElementById("pdfInput");

const imagePreview =
    document.getElementById("imagePreview");

const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

const removeImageBtn =
    document.getElementById("removeImageBtn");

const filePreviewContainer =
    document.getElementById("filePreviewContainer");

const filePreviewName =
    document.getElementById("filePreviewName");

const filePreviewIcon =
    document.getElementById("filePreviewIcon");

const removeFileBtn =
    document.getElementById("removeFileBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPicker =
    document.getElementById("emojiPicker");

const emojiSearch =
    document.getElementById("emojiSearch");

const emojiList =
    document.getElementById("emojiList");

const clearBtn =
    document.getElementById("clearBtn");

const newChatBtn =
    document.getElementById("newChatBtn");

const voiceBtn =
    document.getElementById("voiceBtn");


// ==========================================
// VARIABLES
// ==========================================

let selectedImage = null;
let selectedPdf = null;

let voiceEnabled = true;


// ==========================================
// EMOJI DATA
// ==========================================

const emojiData = {

    smileys: [
        "😀","😃","😄","😁","😆","😅","😂","🤣",
        "😊","😇","🙂","🙃","😉","😌","😍","🥰",
        "😘","😗","😙","😚","😋","😛","😝","😜",
        "🤪","🤨","🧐","🤓","😎","🤩","🥳","😏",
        "😒","😞","😔","😟","😕","🙁","☹️","😣",
        "😖","😫","😩","🥺","😢","😭","😤","😠",
        "😡","🤬","🤯","😳","🥵","🥶","😱","😨",
        "😰","😥","😓","🤗","🤔","🫣","🤭","🫢",
        "🤫","🤥","😶","🫠","😐","😑","😬","🙄",
        "😯","😦","😧","😮","😲","🥱","😴","🤤",
        "😪","😵","🤐","🥴","🤢","🤮","🤧","😷",
        "🤒","🤕","🤑","🤠","😈","👿","👹","👺",
        "🤡","💩","👻","💀","☠️","👽","👾","🤖",
        "🎃","😺","😸","😹","😻","😼","😽","🙀",
        "😿","😾"
    ],

    people: [
        "👋","🤚","🖐️","✋","🖖","👌","🤏","✌️",
        "🤞","🤟","🤘","🤙","👈","👉","👆","👇",
        "☝️","👍","👎","✊","👊","🤛","🤜","👏",
        "🙌","👐","🤲","🤝","🙏","✍️","💅","🤳",
        "💪","🦵","🦶","👂","👃","🧠","🫀","🫁",
        "🦷","🦴","👀","👁️","👅","👄","💋"
    ],

    animals: [
        "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼",
        "🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈",
        "🙉","🙊","🐒","🐔","🐧","🐦","🐤","🦆",
        "🦅","🦉","🐺","🐗","🐴","🦄","🐝","🐛",
        "🦋","🐌","🐞","🐜","🕷️","🦂","🐢","🐍",
        "🦎","🦖","🦕","🐙","🦑","🦀","🐠","🐟",
        "🐡","🐬","🐳","🐋","🦈","🐊","🐘","🦏",
        "🦛","🐪","🐫","🦒","🦘","🐃","🐂","🐄",
        "🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕",
        "🐈","🐓","🦃","🦜","🦢","🦩","🐇","🦔"
    ],

    food: [
        "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇",
        "🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥",
        "🥝","🍅","🥑","🍆","🥔","🥕","🌽","🌶️",
        "🥒","🥬","🥦","🧄","🧅","🍄","🥜","🌰",
        "🍞","🥐","🥖","🧀","🥚","🍳","🧈","🥞",
        "🧇","🥓","🥩","🍗","🍔","🍟","🍕","🌭",
        "🥪","🌮","🌯","🥗","🍝","🍜","🍲","🍛",
        "🍣","🍤","🍚","🍙","🍘","🍥","🥟","🍦",
        "🍧","🍨","🍩","🍪","🎂","🍰","🧁","🍫",
        "🍬","🍭","☕","🧃","🥤","🧋"
    ],

    activities: [
        "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉",
        "🎱","🏓","🏸","🏒","🏑","🥍","🏏","⛳",
        "🏹","🎣","🥊","🥋","⛷️","🏂","🏋️","🤸",
        "🤼","🤽","🤾","🏌️","🏇","🚴","🚵","🏆",
        "🥇","🥈","🥉","🏅","🎖️","🎯","🎮","🕹️",
        "🎲","🎳","🎭","🎨","🎬","🎤","🎧","🎼",
        "🎸","🎹","🥁","🎷","🎺"
    ],

    travel: [
        "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑",
        "🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍️",
        "🚲","✈️","🚁","🚀","🛸","🚢","⛵","🚤",
        "🚆","🚇","🚉","🏠","🏢","🏥","🏫","🏨",
        "🗽","🗼","🏰","🏯","🌋","🏖️","🏝️","🌅",
        "🌄","🌇","🌃","🌌","🌍","🌎","🌏"
    ],

    objects: [
        "💡","🔦","📱","💻","⌨️","🖥️","🖨️","📷",
        "📺","📻","☎️","📞","🔋","🔌","💿","📀",
        "📚","📖","📝","✏️","🖊️","📌","📍","📎",
        "🔑","🔒","🔓","🔔","🎁","🎈","🎉","🧸",
        "🛒","💰","💎","🔧","🔨","⚙️","🧰","🕰️"
    ],

    symbols: [
        "❤️","🧡","💛","💚","💙","💜","🖤","🤍",
        "🤎","💔","❣️","💕","💞","💓","💗","💖",
        "💘","💝","💟","☮️","✝️","☪️","🕉️","☯️",
        "☢️","☣️","✅","❌","❗","❓","‼️","⁉️",
        "⭐","🌟","✨","💫","🔥","💯","💥","💦",
        "💨","🎵","🎶","✔️","➕","➖","➡️","⬅️"
    ],

    flags: [
        "🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇯🇵","🇨🇳",
        "🇰🇷","🇫🇷","🇩🇪","🇮🇹","🇪🇸","🇧🇷","🇷🇺",
        "🇦🇪","🇸🇬","🇳🇵","🇱🇰","🇵🇰","🇧🇩"
    ]

};


// ==========================================
// SHOW EMOJIS
// ==========================================

function showEmojis(category = "smileys") {

    if (!emojiList) return;

    emojiList.innerHTML = "";

    const emojis =
        emojiData[category] || [];

    emojis.forEach(function (emoji) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "emoji-item";

        button.textContent =
            emoji;

        button.addEventListener(
            "click",
            function () {

                insertEmoji(emoji);

            }
        );

        emojiList.appendChild(button);

    });

}


// ==========================================
// INSERT EMOJI
// ==========================================

function insertEmoji(emoji) {

    if (!userInput) return;

    const start =
        userInput.selectionStart;

    const end =
        userInput.selectionEnd;

    const text =
        userInput.value;

    userInput.value =
        text.substring(0, start)
        + emoji
        + text.substring(end);

    userInput.focus();

    userInput.selectionStart =
        userInput.selectionEnd =
        start + emoji.length;

}


// ==========================================
// EMOJI BUTTON
// ==========================================

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (
                emojiPicker.style.display ===
                "block"
            ) {

                emojiPicker.style.display =
                    "none";

            } else {

                emojiPicker.style.display =
                    "block";

                showEmojis("smileys");

            }

        }
    );

}


// ==========================================
// CATEGORY BUTTONS
// ==========================================

document
    .querySelectorAll(".emoji-category")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".emoji-category"
                    )
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    });

                button.classList.add(
                    "active"
                );

                showEmojis(
                    button.dataset.category
                );

            }
        );

    });


// ==========================================
// EMOJI SEARCH
// ==========================================

if (emojiSearch) {

    emojiSearch.addEventListener(
        "input",
        function () {

            const search =
                emojiSearch.value
                    .trim()
                    .toLowerCase();

            emojiList.innerHTML = "";

            let allEmojis = [];

            Object.values(
                emojiData
            ).forEach(function (list) {

                allEmojis =
                    allEmojis.concat(list);

            });

            if (!search) {

                showEmojis("smileys");

                return;

            }

            allEmojis.forEach(
                function (emoji) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type = "button";

                    button.className =
                        "emoji-item";

                    button.textContent =
                        emoji;

                    button.addEventListener(
                        "click",
                        function () {

                            insertEmoji(emoji);

                        }
                    );

                    emojiList.appendChild(
                        button
                    );

                }
            );

        }
    );

}


// ==========================================
// CLOSE EMOJI PICKER
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            emojiPicker &&
            emojiBtn &&
            !emojiPicker.contains(event.target) &&
            !emojiBtn.contains(event.target)
        ) {

            emojiPicker.style.display =
                "none";

        }

    }
);


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (uploadBtn && imageInput) {

    uploadBtn.addEventListener(
        "click",
        function () {

            imageInput.click();

        }
    );

}


// ==========================================
// IMAGE SELECT
// ==========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select a valid image."
                );

                this.value = "";

                return;

            }

            selectedImage = file;

            const reader =
                new FileReader();

            reader.onload =
                function (event) {

                    if (imagePreview) {

                        imagePreview.src =
                            event.target.result;

                    }

                    if (
                        imagePreviewContainer
                    ) {

                        imagePreviewContainer
                            .style.display =
                            "flex";

                    }

                };

            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// REMOVE IMAGE
// ==========================================

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        function () {

            selectedImage = null;

            if (imageInput) {

                imageInput.value = "";

            }

            if (imagePreview) {

                imagePreview.src = "";

            }

            if (
                imagePreviewContainer
            ) {

                imagePreviewContainer
                    .style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// PDF BUTTON
// ==========================================

if (pdfBtn && pdfInput) {

    pdfBtn.addEventListener(
        "click",
        function () {

            pdfInput.click();

        }
    );

}


// ==========================================
// PDF SELECT
// ==========================================

if (pdfInput) {

    pdfInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;

            if (
                file.type !== "application/pdf"
                &&
                !file.name
                    .toLowerCase()
                    .endsWith(".pdf")
            ) {

                alert(
                    "Please select a valid PDF file."
                );

                this.value = "";

                return;

            }

            selectedPdf = file;

            if (filePreviewName) {

                filePreviewName.textContent =
                    file.name;

            }

            if (filePreviewIcon) {

                filePreviewIcon.textContent =
                    "📄";

            }

            if (filePreviewContainer) {

                filePreviewContainer
                    .style.display =
                    "flex";

            }

        }
    );

}


// ==========================================
// REMOVE PDF
// ==========================================

if (removeFileBtn) {

    removeFileBtn.addEventListener(
        "click",
        function () {

            selectedPdf = null;

            if (pdfInput) {

                pdfInput.value = "";

            }

            if (filePreviewName) {

                filePreviewName.textContent =
                    "";

            }

            if (filePreviewContainer) {

                filePreviewContainer
                    .style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(
    sender,
    message,
    type
) {

    const row =
        document.createElement("div");

    row.className =
        "message-row "
        + type
        + "-row";

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message "
        + type
        + "-message";

    const name =
        document.createElement("div");

    name.className =
        "message-name";

    name.textContent =
        sender;

    const text =
        document.createElement("div");

    text.className =
        "message-text";

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

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// ADD IMAGE MESSAGE
// ==========================================

function addImageMessage(file) {

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
        URL.createObjectURL(file);

    img.style.maxWidth =
        "250px";

    img.style.maxHeight =
        "250px";

    img.style.borderRadius =
        "12px";

    img.style.marginTop =
        "8px";

    messageDiv.appendChild(name);
    messageDiv.appendChild(img);

    row.appendChild(messageDiv);

    chatBox.appendChild(row);

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// ADD PDF MESSAGE
// ==========================================

function addPdfMessage(file) {

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

    const pdfBox =
        document.createElement("div");

    pdfBox.className =
        "pdf-message";

    pdfBox.textContent =
        "📄 " + file.name;

    messageDiv.appendChild(name);
    messageDiv.appendChild(pdfBox);

    row.appendChild(messageDiv);

    chatBox.appendChild(row);

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// TYPING
// ==========================================

function showTyping() {

    const row =
        document.createElement("div");

    row.className =
        "message-row bot-row";

    row.id =
        "typingMessage";

    const message =
        document.createElement("div");

    message.className =
        "message bot-message";

    message.textContent =
        "🤖 NeuraChat AI is thinking...";

    row.appendChild(message);

    chatBox.appendChild(row);

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// REMOVE TYPING
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
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const message =
        userInput.value.trim();

    if (
        !message &&
        !selectedImage &&
        !selectedPdf
    ) {

        return;

    }


    // Show text

    if (message) {

        addMessage(
            "👤 You",
            message,
            "user"
        );

    }


    // Save files

    const imageToSend =
        selectedImage;

    const pdfToSend =
        selectedPdf;


    // Show image

    if (imageToSend) {

        addImageMessage(
            imageToSend
        );

    }


    // Show PDF

    if (pdfToSend) {

        addPdfMessage(
            pdfToSend
        );

    }


    // Clear input

    userInput.value = "";

    selectedImage = null;
    selectedPdf = null;


    if (imageInput) {

        imageInput.value = "";

    }

    if (pdfInput) {

        pdfInput.value = "";

    }


    if (imagePreview) {

        imagePreview.src = "";

    }

    if (imagePreviewContainer) {

        imagePreviewContainer
            .style.display =
            "none";

    }


    if (filePreviewContainer) {

        filePreviewContainer
            .style.display =
            "none";

    }


    // Typing

    showTyping();


    try {

        let response;


        // ======================================
        // TEXT ONLY
        // ======================================

        if (
            !imageToSend &&
            !pdfToSend
        ) {

            response =
                await fetch(
                    "/get_response",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message:
                                    message
                            })

                    }
                );

        }


        // ======================================
        // FILE REQUEST
        // ======================================

        else {

            const formData =
                new FormData();

            formData.append(
                "message",
                message
            );


            if (imageToSend) {

                formData.append(
                    "image",
                    imageToSend
                );

            }


            if (pdfToSend) {

                formData.append(
                    "pdf",
                    pdfToSend
                );

            }


            response =
                await fetch(
                    "/get_response",
                    {

                        method: "POST",

                        body: formData

                    }
                );

        }


        // ======================================
        // RESPONSE
        // ======================================

        const data =
            await response.json();

        removeTyping();

        const reply =
            data.response ||
            "Sorry, I couldn't get a response.";

        addMessage(
            "🤖 NeuraChat AI",
            reply,
            "bot"
        );

        speakText(reply);

    }


    catch (error) {

        console.error(
            "Chat Error:",
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
// VOICE ON / OFF
// ==========================================

if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            voiceEnabled =
                !voiceEnabled;

            if (voiceEnabled) {

                voiceBtn.textContent =
                    "🔊";

                voiceBtn.title =
                    "Voice On";

            }

            else {

                voiceBtn.textContent =
                    "🔇";

                voiceBtn.title =
                    "Voice Off";

                if (
                    "speechSynthesis"
                    in window
                ) {

                    window.speechSynthesis.cancel();

                }

            }

        }
    );

}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakText(text) {

    if (!voiceEnabled) return;

    if (
        !("speechSynthesis" in window)
    ) return;

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang =
        "en-US";

    speech.rate =
        1;

    speech.pitch =
        1;

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

            recognition.interimResults =
                false;

            recognition.continuous =
                false;

            micBtn.textContent =
                "🔴";

            micBtn.classList.add(
                "listening"
            );

            recognition.start();

            recognition.onresult =
                function (event) {

                    userInput.value =
                        event.results[0][0]
                            .transcript;

                };

            recognition.onend =
                function () {

                    micBtn.textContent =
                        "🎤";

                    micBtn.classList.remove(
                        "listening"
                    );

                };

            recognition.onerror =
                function () {

                    micBtn.textContent =
                        "🎤";

                    micBtn.classList.remove(
                        "listening"
                    );

                };

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
// INITIAL EMOJIS
// ==========================================

showEmojis("smileys");
