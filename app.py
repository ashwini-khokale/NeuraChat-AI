from flask import Flask, render_template, request, jsonify
from google import genai
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load API Key
load_dotenv()

# Get API Key
api_key = os.getenv("GOOGLE_API_KEY")

# Create Gemini Client
client = genai.Client(
    api_key=api_key
)


# =====================================================
# CHECK AVAILABLE GEMINI MODELS
# =====================================================

try:
    print("===== AVAILABLE MODELS =====", flush=True)

    for model in client.models.list():
        print(model.name, flush=True)

    print("===== END MODELS =====", flush=True)

except Exception as e:
    print("MODEL LIST ERROR:", str(e), flush=True)


# =====================================================
# STORE CHAT HISTORY
# =====================================================

chat_history = []


# =====================================================
# HOME PAGE
# =====================================================

@app.route("/")
def home():
    return render_template("index.html")


# =====================================================
# CHAT PAGE
# =====================================================

@app.route("/chat")
def chat():
    return render_template("chat.html")


# =====================================================
# AI RESPONSE
# =====================================================

@app.route("/get_response", methods=["POST"])
def get_response():

    global chat_history

    try:

        # Get user message
        data = request.json

        if not data or "message" not in data:
            return jsonify({
                "response": "कृपया काहीतरी message लिहा. 😊"
            })

        user_message = data["message"].strip()

        if not user_message:
            return jsonify({
                "response": "कृपया काहीतरी message लिहा. 😊"
            })


        # Add user message
        chat_history.append(
            f"User: {user_message}"
        )


        # Keep only last 50 messages
        if len(chat_history) > 50:
            chat_history = chat_history[-50:]


        # Create conversation
        conversation = "\n".join(chat_history)


        # =================================================
        # PROMPT
        # =================================================

        prompt = f"""
You are NeuraChat AI, a friendly and intelligent AI assistant.

Rules:

- Reply in a friendly and natural tone.
- Keep answers short unless the user asks for details.
- Explain coding topics with simple examples.
- If the user greets you, greet them warmly.
- Always reply in the same language that the user uses.
- If the user asks in Marathi, reply only in Marathi.
- If the user asks in Hindi, reply only in Hindi.
- If the user asks in English, reply only in English.
- Answer accurately and clearly.
- Use emojis only when they fit naturally.
- If you don't know something, say so honestly instead of making it up.

If the user asks who created you, reply:

"मी NeuraChat AI आहे. माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी कॉलेज AI Project म्हणून Python, Flask आणि Google's Gemini API वापरून केली आहे."

If the user asks why you were developed, reply:

"माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी विद्यार्थ्यांना शिक्षण, Coding, General Knowledge आणि दैनंदिन प्रश्नांमध्ये मदत करण्यासाठी एका मैत्रीपूर्ण आणि बहुभाषिक AI Chatbot म्हणून केली आहे."

- Never say you were developed by OpenAI or Google.
- Explain that you use Google's Gemini API, but the NeuraChat AI application itself was developed by Ashwini Khokale and Prajakta Wani.

Conversation:

{conversation}

AI:
"""


        # =================================================
        # GEMINI API
        # =================================================

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )


        # Get AI response
        reply = response.text


        # Save AI reply
        chat_history.append(
            f"AI: {reply}"
        )


        # Send response to frontend
        return jsonify({
            "response": reply
        })


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        error_message = str(e)

        # Show real error in Render Logs
        print(
            "================ GEMINI ERROR ================",
            flush=True
        )

        print(
            error_message,
            flush=True
        )

        print(
            "================================================",
            flush=True
        )


        # 401 Authentication error
        if "401" in error_message or "UNAUTHENTICATED" in error_message:

            reply = (
                "⚠️ Gemini API key authentication problem आहे. "
                "कृपया API key तपासा."
            )


        # 404 Model error
        elif "404" in error_message or "NOT_FOUND" in error_message:

            reply = (
                "⚠️ सध्या वापरलेला Gemini model उपलब्ध नाही. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )


        # 429 Limit error
        elif "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:

            reply = (
                "⚠️ सध्या AI service ची limit पूर्ण झाली आहे. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )


        # 503 Server busy
        elif "503" in error_message or "UNAVAILABLE" in error_message:

            reply = (
                "⚠️ Gemini service सध्या busy आहे. "
                "कृपया काही सेकंदांनी पुन्हा प्रयत्न करा."
            )


        # Other error
        else:

            reply = (
                "⚠️ Server connection problem. "
                "Please try again."
            )


        return jsonify({
            "response": reply
        })


# =====================================================
# RUN APP
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)
