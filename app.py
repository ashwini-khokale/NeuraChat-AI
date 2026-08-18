from flask import Flask, render_template, request, jsonify
from google import genai
import os
from dotenv import load_dotenv


app = Flask(__name__)


# Load API Key
load_dotenv()


# Create Gemini Client
client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
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

    user_message = request.json["message"]


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
- Always reply in the same language that the user uses (Marathi, Hindi, or English).
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


    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )


        reply = response.text


        # Save AI reply
        chat_history.append(f"AI: {reply}")



    except Exception as e:

        error_message = str(e)
print("GEMINI ERROR:", str(e))

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:

            reply = "माफ करा, सध्या AI service ची limit पूर्ण झाली आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा. 😊"


        else:

            reply = "माफ करा, काही technical problem आली आहे. कृपया पुन्हा प्रयत्न करा. 😊"



    return jsonify({"response": reply})



if __name__ == "__main__":
    app.run(debug=True)
