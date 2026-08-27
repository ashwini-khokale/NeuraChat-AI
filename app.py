from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

app = Flask(__name__)

# =====================================================
# LOAD API KEY
# =====================================================

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("WARNING: GOOGLE_API_KEY is not set!", flush=True)

# =====================================================
# CREATE GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=api_key
)

# =====================================================
# LIST AVAILABLE GEMINI MODELS
# =====================================================

print("==============================================", flush=True)
print("AVAILABLE GEMINI MODELS:", flush=True)

try:
    for model in client.models.list():

        supported_actions = (
            getattr(model, "supported_actions", [])
            or []
        )

        if "generateContent" in supported_actions:
            print(model.name, flush=True)

except Exception as e:
    print(
        "Could not list Gemini models:",
        str(e),
        flush=True
    )

print("==============================================", flush=True)

# =====================================================
# CHAT HISTORY
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

        # =================================================
        # GET IMAGE
        # =================================================

        image_file = request.files.get("image")

        # =================================================
        # GET PDF
        # =================================================

        pdf_file = request.files.get("pdf")

        # =================================================
        # GET MESSAGE
        # =================================================

        if request.is_json:

            data = request.get_json()

            user_message = (
                data.get("message", "").strip()
                if data
                else ""
            )

        else:

            user_message = request.form.get(
                "message",
                ""
            ).strip()

        # =================================================
        # EMPTY REQUEST
        # =================================================

        if (
            not user_message
            and not image_file
            and not pdf_file
        ):

            return jsonify({
                "response":
                "कृपया message लिहा किंवा image/PDF upload करा. 😊"
            })

        # =================================================
        # STORE USER MESSAGE
        # =================================================

        if user_message:

            chat_history.append(
                f"User: {user_message}"
            )

        # =================================================
        # KEEP LAST 50 MESSAGES
        # =================================================

        if len(chat_history) > 50:

            chat_history = chat_history[-50:]

        # =================================================
        # CONVERSATION
        # =================================================

        conversation_text = "\n".join(
            chat_history
        )

        # =================================================
        # AI PROMPT
        # =================================================

        prompt = f"""
You are NeuraChat AI, a friendly and intelligent AI assistant.

Rules:

- Reply in a friendly and natural tone.
- Keep answers short unless the user asks for details.
- Explain coding topics with simple examples.
- If the user greets you, greet them warmly.
- Always reply in the same language that the user uses.
- If the user asks in Marathi, reply in Marathi.
- If the user asks in Hindi, reply in Hindi.
- If the user asks in English, reply in English.
- Answer accurately and clearly.
- Use emojis naturally when appropriate.
- If the user uploads an image, analyze it carefully.
- If the user uploads a PDF, read and analyze the PDF carefully.
- If the user asks questions about a PDF, answer using the uploaded PDF.
- If the user asks to extract questions from a PDF, extract relevant questions from the PDF.
- Do not invent information that is not present in the uploaded PDF.
- If the requested information is not available in the PDF, clearly say that.

If the user asks who created you, reply:

"मी NeuraChat AI आहे. माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी कॉलेज AI Project म्हणून Java, Flask आणि Google's Gemini API वापरून केली आहे."

If the user asks why you were developed, reply:

"माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी विद्यार्थ्यांना शिक्षण, Coding, General Knowledge आणि दैनंदिन प्रश्नांमध्ये मदत करण्यासाठी एका मैत्रीपूर्ण आणि बहुभाषिक AI Chatbot म्हणून केली आहे."

- Never say that NeuraChat AI itself was developed by OpenAI or Google.
- You may explain that NeuraChat AI uses Google's Gemini API.

Conversation:

{conversation_text}
"""

        # =================================================
        # CONTENTS
        # =================================================

        contents = []

        # =================================================
        # IMAGE
        # =================================================

        if image_file:

            image_bytes = image_file.read()

            mime_type = (
                image_file.mimetype
                or "image/jpeg"
            )

            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )

            contents.append(image_part)

        # =================================================
        # PDF
        # =================================================

        if pdf_file:

            pdf_bytes = pdf_file.read()

            pdf_part = types.Part.from_bytes(
                data=pdf_bytes,
                mime_type="application/pdf"
            )

            contents.append(pdf_part)

        # =================================================
        # PROMPT
        # =================================================

        contents.append(prompt)

        # =================================================
        # GEMINI REQUEST
        # =================================================

        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=contents
        )

        # =================================================
        # RESPONSE TEXT
        # =================================================

        reply = response.text

        if not reply:

            reply = "⚠️ मला response मिळाला नाही."

        # =================================================
        # SAVE AI RESPONSE
        # =================================================

        chat_history.append(
            f"AI: {reply}"
        )

        # =================================================
        # RETURN
        # =================================================

        return jsonify({
            "response": reply
        })

    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        error_message = str(e)

        print(
            "==============================================",
            flush=True
        )

        print(
            "GEMINI ERROR:",
            flush=True
        )

        print(
            error_message,
            flush=True
        )

        print(
            "==============================================",
            flush=True
        )

        # =================================================
        # API KEY ERROR
        # =================================================

        if (
            "401" in error_message
            or "UNAUTHENTICATED" in error_message
            or "API key" in error_message
            or "authentication" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini API key authentication problem आहे. "
                "Render Environment Variables मध्ये GOOGLE_API_KEY तपासा."
            )

        # =================================================
        # MODEL ERROR
        # =================================================

        elif (
            "404" in error_message
            or "NOT_FOUND" in error_message
            or "not found" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini model उपलब्ध नाही. "
                "Render Logs मध्ये available models तपासा."
            )

        # =================================================
        # RATE LIMIT
        # =================================================

        elif (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
            or "quota" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini API ची usage limit पूर्ण झाली आहे. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )

        # =================================================
        # SERVER BUSY
        # =================================================

        elif (
            "503" in error_message
            or "UNAVAILABLE" in error_message
        ):

            reply = (
                "⚠️ Gemini service सध्या busy आहे. "
                "कृपया काही सेकंदांनी पुन्हा प्रयत्न करा."
            )

        # =================================================
        # PDF / FILE ERROR
        # =================================================

        elif (
            "pdf" in error_message.lower()
            or "file" in error_message.lower()
        ):

            reply = (
                "⚠️ PDF process करताना problem आली. "
                "कृपया PDF पुन्हा upload करून try करा."
            )

        # =================================================
        # OTHER ERROR
        # =================================================

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

    app.run(
        host="0.0.0.0",
        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),
        debug=False
    )
