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


# =====================================================
# CREATE GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=api_key
)


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
        # CHECK IMAGE
        # =================================================

        image_file = request.files.get("image")

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
        # EMPTY MESSAGE + NO IMAGE
        # =================================================

        if not user_message and not image_file:

            return jsonify({
                "response":
                "कृपया message लिहा किंवा image upload करा. 😊"
            })


        # =================================================
        # STORE TEXT MESSAGE
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
        # COMMON AI PROMPT
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

"मी NeuraChat AI आहे. माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी कॉलेज AI Project म्हणून Java, Flask आणि Google's Gemini API वापरून केली आहे."

If the user asks why you were developed, reply:

"माझी निर्मिती Ashwini Khokale आणि Prajakta Wani यांनी विद्यार्थ्यांना शिक्षण, Coding, General Knowledge आणि दैनंदिन प्रश्नांमध्ये मदत करण्यासाठी एका मैत्रीपूर्ण आणि बहुभाषिक AI Chatbot म्हणून केली आहे."

- Never say you were developed by OpenAI or Google.
- Explain that you use Google's Gemini API, but the NeuraChat AI application itself was developed by Ashwini Khokale and Prajakta Wani.

Conversation:

{" ".join(chat_history)}

"""


        # =================================================
        # IMAGE REQUEST
        # =================================================

        if image_file:

            # Read image bytes

            image_bytes = image_file.read()

            mime_type = (
                image_file.mimetype
                or "image/jpeg"
            )


            # Create Gemini image part

            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )


            # If user did not write a question

            if user_message:

                image_prompt = f"""
{prompt}

The user has uploaded an image.

User's question about the image:

{user_message}

Analyze the image carefully and answer the user's question.
"""

            else:

                image_prompt = f"""
{prompt}

The user has uploaded an image.

Analyze the image carefully and describe what you can see.
"""


            # =================================================
            # GEMINI IMAGE + TEXT
            # =================================================

            response = client.models.generate_content(

                model="gemini-2.5-flash",

                contents=[
                    image_part,
                    image_prompt
                ]

            )


        # =================================================
        # TEXT ONLY REQUEST
        # =================================================

        else:

            response = client.models.generate_content(

                model="gemini-2.5-flash",

                contents=prompt

            )


        # =================================================
        # GET AI RESPONSE
        # =================================================

        reply = response.text


        # =================================================
        # SAVE AI RESPONSE
        # =================================================

        chat_history.append(
            f"AI: {reply}"
        )


        # =================================================
        # RETURN RESPONSE
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


        # =================================================
        # API KEY ERROR
        # =================================================

        if (
            "401" in error_message
            or "UNAUTHENTICATED" in error_message
            or "API key" in error_message
        ):

            reply = (
                "⚠️ Gemini API key authentication problem आहे. "
                "कृपया API key तपासा."
            )


        # =================================================
        # MODEL ERROR
        # =================================================

        elif (
            "404" in error_message
            or "NOT_FOUND" in error_message
        ):

            reply = (
                "⚠️ Gemini model उपलब्ध नाही. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )


        # =================================================
        # LIMIT ERROR
        # =================================================

        elif (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):

            reply = (
                "⚠️ सध्या AI service ची limit पूर्ण झाली आहे. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )


        # =================================================
        # SERVER ERROR
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
        debug=True
    )
