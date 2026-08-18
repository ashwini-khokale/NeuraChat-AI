from flask import Flask, render_template, request, jsonify
from google import genai
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load API Key
load_dotenv()

# Create Gemini Client
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(
    api_key=api_key
)

# Store chat history
chat_history = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/get_response", methods=["POST"])
def get_response():

    global chat_history

    try:
        user_message = request.json.get("message", "").strip()

        if not user_message:
            return jsonify({
                "response": "कृपया काहीतरी message लिहा. 😊"
            })

        # Add user message
        chat_history.append(f"User: {user_message}")

        # Keep only last 50 messages
        if len(chat_history) > 50:
            chat_history = chat_history[-50:]

        conversation = "\n".join(chat_history)

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

        # Gemini API call
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        reply = response.text

        # Save AI reply
        chat_history.append(f"AI: {reply}")

        return jsonify({
            "response": reply
        })

    except Exception as e:

        # Show actual error in Render Logs
        print("GEMINI ERROR:", str(e), flush=True)

        error_message = str(e)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            reply = "माफ करा, सध्या AI service ची limit पूर्ण झाली आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा. 😊"

        elif "401" in error_message or "UNAUTHENTICATED" in error_message:
            reply = "⚠️ Gemini API key authentication problem आहे. कृपया API key तपासा."

        elif "404" in error_message or "NOT_FOUND" in error_message:
            reply = "⚠️ सध्या वापरलेला Gemini model उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."

        elif "503" in error_message or "UNAVAILABLE" in error_message:
            reply = "⚠️ Gemini service सध्या busy आहे. कृपया काही सेकंदांनी पुन्हा प्रयत्न करा."

        else:
            reply = "⚠️ Server connection problem. Please try again."

        return jsonify({
            "response": reply
        })


if __name__ == "__main__":
    app.run(debug=True)
