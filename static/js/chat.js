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

const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

const removeImageBtn =
    document.getElementById("removeImageBtn");

const clearBtn = document.getElementById("clearBtn");
const newChatBtn = document.getElementById("newChatBtn");
const voiceBtn = document.getElementById("voiceBtn");

const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const emojiSearch = document.getElementById("emojiSearch");
const emojiList = document.getElementById("emojiList");
const emojiCategories =
    document.querySelectorAll(".emoji-category");


// ==========================================
// VARIABLES
// ==========================================

let selectedImage = null;
let voiceEnabled = true;

let currentEmojiCategory = "smileys";


// ==========================================
// EMOJI DATA
// ==========================================

const emojiData = {

    smileys: [
        "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
        "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
        "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩",
        "🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣",
        "😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬",
        "🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗",
        "🤔","🫣","🤭","🫢","🫡","🤫","🤥","😶","🫠","😐",
        "😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴",
        "🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒",
        "🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻",
        "💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻",
        "😼","😽","🙀","😿","😾"
    ],

    people: [
        "👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞",
        "🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎",
        "✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏",
        "✍️","💅","🤳","💪","🫶","👀","👁️","👄","👂","👃",
        "🧠","🫀","🫁","🦷","🦴","👶","🧒","👦","👧","🧑",
        "👱","👨","👩","🧔","👵","👴","🧓","🙋","🙆","🙅",
        "🤦","🤷","💁","🙇","🧘","🏃","🚶","💃","🕺","👯"
    ],

    animals: [
        "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
        "🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒",
        "🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇",
        "🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜",
        "🪲","🪳","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙",
        "🦑","🦀","🦞","🐠","🐟","🐡","🦈","🐬","🐳","🐋",
        "🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦏","🦛","🐪",
        "🐫","🦒","🦘","🦬","🐄","🐎","🐖","🐏","🐑","🦙"
    ],

    food: [
        "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐",
        "🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆",
        "🥔","🥕","🌽","🌶️","🫑","🥒","🥬","🥦","🧄","🧅",
        "🍄","🥜","🌰","🍞","🥐","🥖","🥨","🧀","🥚","🍳",
        "🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟",
        "🍕","🥪","🥙","🧆","🌮","🌯","🥗","🍝","🍜","🍲",
        "🍛","🍣","🍱","🥟","🦪","🍚","🍘","🍙","🍰","🎂",
        "🧁","🍪","🍩","🍫","🍿","🍦","🍧","🍨","🍭","🍬",
        "☕","🍵","🧃","🥤","🧋","🍶"
    ],

    activities: [
        "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱",
        "🏓","🏸","🏒","🏑","🥍","🏏","⛳","🏹","🎣","🤿",
        "🥊","🥋","🎽","🛹","🛷","⛸️","🎿","🏂","🏋️","🤼",
        "🤸","⛹️","🤺","🏇","🏆","🥇","🥈","🥉","🏅","🎖️",
        "🎮","🕹️","🎲","🎯","🎳","🎭","🎨","🎬","🎤","🎧",
        "🎼","🎹","🥁","🎸","🎻","🎺","🎷","🪕","🎪","🎟️"
    ],

    travel: [
        "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐",
        "🛻","🚚","🚛","🚜","🛵","🏍️","🚲","🛴","🚨","🚔",
        "🚆","🚇","🚊","🚉","✈️","🛫","🛬","🚁","🚀","🛸",
        "🚢","⛵","🚤","🗺️","🗿","🗽","🗼","🏰","🏯","🏠",
        "🏡","🏢","🏥","🏫","🏨","🏪","🏬","🏭","⛪","🕌",
        "🌍","🌎","🌏","🌋","🏔️","🏖️","🏝️","🏜️","🌅","🌄"
    ],

    objects: [
        "💡","📱","💻","⌨️","🖥️","🖨️","🖱️","💾","💿","📷",
        "📸","📹","🎥","📺","📻","☎️","📞","🔋","🔌","💡",
        "📚","📖","📕","📗","📘","📙","📓","📒","📝","✏️",
        "🖊️","🖋️","📌","📍","📎","✂️","🔒","🔓","🔑","🔨",
        "⚙️","🔧","🛠️","🔬","🔭","💰","💵","💳","🎁","🎈",
        "🎉","🎊","📦","✉️","📧","📅","⏰","⌚","🔔","🎵"
    ],

    symbols: [
        "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","🩷",
        "🩵","🩶","💔","❣️","💕","💞","💓","💗","💖","💘",
        "💝","💟","☮️","✝️","☪️","🕉️","☯️","☢️","☣️","♻️",
        "✅","❌","⭕","❗","❓","‼️","⁉️","⚠️","🚫","💯",
        "🔥","✨","⭐","🌟","💫","💥","💦","💨","🎯","✔️",
        "➕","➖","✖️","➗","♾️","🔴","🟠","🟡","🟢","🔵",
        "🟣","⚫","⚪","🟤"
    ],

    flags: [
        "🇮🇳","🇺🇸","🇬🇧","🇨🇦","🇦🇺","🇯🇵","🇨🇳","🇰🇷","🇩🇪",
        "🇫🇷","🇮🇹","🇪🇸","🇧🇷","🇷🇺","🇦🇪","🇸🇦","🇸🇬","🇳🇵",
        "🇵🇰","🇧🇩","🇱🇰","🇳🇿","🇿🇦","🇮🇩","🇲🇾","🇹🇭","🇻🇳",
        "🇵🇭","🇲🇽","🇦🇷","🇵🇹","🇳🇱","🇨🇭","🇸🇪","🇳🇴","🇩🇰",
        "🇫🇮","🇮🇪","🇬🇷","🇹🇷","🇮🇱","🇪🇬","🇳🇬","🇰🇪","🇺🇦"
    ]

};


// ==========================================
// EMOJI SEARCH KEYWORDS
// ==========================================

const emojiKeywords = {

    "😀": "grinning happy smile",
    "😂": "laugh laughing funny",
    "🤣": "rofl laugh funny",
    "😊": "happy smile",
    "😍": "love heart",
    "🥰": "love happy",
    "😘": "kiss",
    "😎": "cool",
    "🤔": "think thinking",
    "😭": "cry crying sad",
    "😢": "sad cry",
    "😡": "angry",
    "😴": "sleep sleeping",
    "🤗": "hug",
    "👍": "thumb up good yes",
    "👎": "thumb down no",
    "👏": "clap",
    "🙏": "pray please thanks",
    "❤️": "heart love",
    "🔥": "fire hot",
    "⭐": "star",
    "🎉": "party celebration",
    "🐶": "dog puppy",
    "🐱": "cat",
    "🍕": "pizza food",
    "🍔": "burger food",
    "☕": "coffee",
    "⚽": "football soccer",
    "🏀": "basketball",
    "🚗": "car",
    "✈️": "airplane flight",
    "📱": "phone mobile",
    "💻": "computer laptop",
    "📚": "book study education",
    "💡": "idea light bulb",
    "🎤": "microphone music"
};


// ==========================================
// RENDER EMOJIS
// ==========================================

function renderEmojis(list) {

    if (!emojiList) {
        return;
    }

    emojiList.innerHTML = "";

    list.forEach(function (emoji) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "emoji-item";

        button.textContent = emoji;

        button.title =
            emojiKeywords[emoji] || emoji;

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

    if (!userInput) {
        return;
    }

    const start =
        userInput.selectionStart;

    const end =
        userInput.selectionEnd;

    const text =
        userInput.value;

    userInput.value =
        text.substring(0, start) +
        emoji +
        text.substring(end);

    const newPosition =
        start + emoji.length;

    userInput.focus();

    userInput.setSelectionRange(
        newPosition,
        newPosition
    );

}


// ==========================================
// OPEN / CLOSE EMOJI PICKER
// ==========================================

if (emojiBtn && emojiPicker) {

    emojiBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            emojiPicker.classList.toggle(
                "show"
            );

            if (
                emojiPicker.classList.contains(
                    "show"
                )
            ) {

                renderEmojis(
                    emojiData[currentEmojiCategory]
                );

                if (emojiSearch) {

                    emojiSearch.focus();

                }

            }

        }
    );

}


// ==========================================
// CATEGORY BUTTONS
// ==========================================

emojiCategories.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                emojiCategories.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );

                currentEmojiCategory =
                    button.dataset.category;

                if (emojiSearch) {

                    emojiSearch.value = "";

                }

                renderEmojis(
                    emojiData[currentEmojiCategory]
                );

            }
        );

    }
);


// ==========================================
// EMOJI SEARCH
// ==========================================

if (emojiSearch) {

    emojiSearch.addEventListener(
        "input",
        function () {

            const query =
                emojiSearch.value
                    .toLowerCase()
                    .trim();

            if (!query) {

                renderEmojis(
                    emojiData[currentEmojiCategory]
                );

                return;

            }

            let results = [];

            Object.keys(emojiData).forEach(
                function (category) {

                    emojiData[category].forEach(
                        function (emoji) {

                            const keyword =
                                emojiKeywords[emoji] || "";

                            if (
                                keyword
                                    .toLowerCase()
                                    .includes(query)
                            ) {

                                results.push(
                                    emoji
                                );

                            }

                        }
                    );

                }
            );

            results =
                [...new Set(results)];

            renderEmojis(results);

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

            emojiPicker.classList.remove(
                "show"
            );

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

            const file = this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

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

                    if (imagePreviewContainer) {

                        imagePreviewContainer.style.display =
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

            if (imagePreviewContainer) {

                imagePreviewContainer.style.display =
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
        "message-row " +
        type +
        "-row";

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message " +
        type +
        "-message";

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

    if (!message && !selectedImage) {

        return;

    }

    if (message) {

        addMessage(
            "👤 You",
            message,
            "user"
        );

    }

    const imageToSend =
        selectedImage;

    if (imageToSend) {

        addImageMessage(
            imageToSend
        );

    }

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

    if (emojiPicker) {

        emojiPicker.classList.remove(
            "show"
        );

    }

    showTyping();

    try {

        let response;

        if (!imageToSend) {

            response =
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

        }

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

            response =
                await fetch(
                    "/get_response",
                    {
                        method: "POST",
                        body: formData
                    }
                );

        }

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

    if (!voiceEnabled) {

        return;

    }

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }

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

            recognition.start();

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
