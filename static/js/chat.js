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

const clearBtn =
    document.getElementById("clearBtn");

const newChatBtn =
    document.getElementById("newChatBtn");

const voiceBtn =
    document.getElementById("voiceBtn");


// ==========================================
// EXAM ELEMENTS
// ==========================================

const examModeBtn =
    document.getElementById("examModeBtn");

const examPanel =
    document.getElementById("examPanel");

const examTopic =
    document.getElementById("examTopic");

const examQuestions =
    document.getElementById("examQuestions");

const startExamBtn =
    document.getElementById("startExamBtn");

const endExamBtn =
    document.getElementById("endExamBtn");

const examStatus =
    document.getElementById("examStatus");


// ==========================================
// VARIABLES
// ==========================================

let selectedImage = null;

let voiceEnabled = true;

let examActive = false;


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


    showTyping();


    try {

        let response;


        // ======================================
        // TEXT
        // ======================================

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

                        body:
                            JSON.stringify({
                                message:
                                    message
                            })
                    }
                );

        }


        // ======================================
        // IMAGE
        // ======================================

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

                        body:
                            formData
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


        // ======================================
        // EXAM STATUS
        // ======================================

        if (data.exam) {

            examActive = true;


            updateExamStatus(
                data.question_number,
                data.total_questions,
                data.score
            );

        }


        if (data.finished) {

            examActive = false;


            updateExamStatus(
                0,
                data.total_questions,
                data.score
            );


            endExamBtn.style.display =
                "none";

        }


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
// ENTER
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
// EXAM MODE BUTTON
// ==========================================

if (examModeBtn) {

    examModeBtn.addEventListener(
        "click",
        function () {

            if (!examPanel) {

                return;

            }


            if (
                examPanel.style.display === "none" ||
                examPanel.style.display === ""
            ) {

                examPanel.style.display =
                    "block";

            }

            else {

                examPanel.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// START EXAM
// ==========================================

if (startExamBtn) {

    startExamBtn.addEventListener(
        "click",
        async function () {

            const topic =
                examTopic.value.trim();


            let questions =
                parseInt(
                    examQuestions.value
                );


            if (!topic) {

                alert(
                    "Please enter exam topic."
                );

                return;

            }


            if (
                isNaN(questions) ||
                questions < 1
            ) {

                questions = 5;

            }


            if (questions > 20) {

                questions = 20;

            }


            // Clear chat

            chatBox.innerHTML = "";


            addMessage(
                "🤖 NeuraChat AI",
                "📝 Exam Mode Started!\n📚 Topic: " +
                topic +
                "\n📊 Questions: " +
                questions,
                "bot"
            );


            showTyping();


            try {

                const response =
                    await fetch(
                        "/start_exam",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    topic:
                                        topic,

                                    questions:
                                        questions
                                })
                        }
                    );


                const data =
                    await response.json();


                removeTyping();


                addMessage(
                    "🤖 NeuraChat AI",
                    data.response,
                    "bot"
                );


                if (data.exam) {

                    examActive = true;


                    updateExamStatus(
                        data.question_number,
                        data.total_questions,
                        data.score
                    );


                    startExamBtn.style.display =
                        "none";


                    endExamBtn.style.display =
                        "inline-block";

                }

            }


            catch (error) {

                console.error(
                    "Exam Error:",
                    error
                );


                removeTyping();


                addMessage(
                    "🤖 NeuraChat AI",
                    "⚠️ Could not start exam.",
                    "bot"
                );

            }

        }
    );

}


// ==========================================
// UPDATE EXAM STATUS
// ==========================================

function updateExamStatus(
    question,
    total,
    score
) {

    if (!examStatus) {

        return;

    }


    examStatus.style.display =
        "block";


    if (question === 0) {

        examStatus.textContent =
            "🏆 Final Score: " +
            score +
            "/" +
            total;

        return;

    }


    examStatus.textContent =
        "📝 Question " +
        question +
        "/" +
        total +
        "    |    🏆 Score: " +
        score;

}


// ==========================================
// END EXAM
// ==========================================

if (endExamBtn) {

    endExamBtn.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/end_exam",
                        {
                            method: "POST"
                        }
                    );


                const data =
                    await response.json();


                addMessage(
                    "🤖 NeuraChat AI",
                    data.response,
                    "bot"
                );


                examActive = false;


                endExamBtn.style.display =
                    "none";


                startExamBtn.style.display =
                    "inline-block";


                examStatus.style.display =
                    "block";


            }


            catch (error) {

                console.error(
                    "End Exam Error:",
                    error
                );

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


            examActive = false;


            if (examStatus) {

                examStatus.style.display =
                    "none";

            }


            if (startExamBtn) {

                startExamBtn.style.display =
                    "inline-block";

            }


            if (endExamBtn) {

                endExamBtn.style.display =
                    "none";

            }

        }
    );

}
