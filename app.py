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

            print(
                model.name,
                flush=True
            )

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
# EXAM MEMORY
# =====================================================

exam_mode = False
exam_topic = ""
exam_total_questions = 5
exam_current_question = 0
exam_score = 0
exam_started = False


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
# START EXAM
# =====================================================

@app.route("/start_exam", methods=["POST"])
def start_exam():

    global exam_mode
    global exam_topic
    global exam_total_questions
    global exam_current_question
    global exam_score
    global exam_started
    global chat_history

    try:

        data = request.get_json() or {}

        exam_topic = data.get(
            "topic",
            ""
        ).strip()

        exam_total_questions = int(
            data.get(
                "questions",
                5
            )
        )

        # Limit questions

        if exam_total_questions < 1:
            exam_total_questions = 1

        if exam_total_questions > 20:
            exam_total_questions = 20


        if not exam_topic:

            return jsonify({
                "response":
                "कृपया exam topic किंवा subject लिहा. 😊"
            })


        # Reset exam

        exam_mode = True
        exam_started = True
        exam_current_question = 1
        exam_score = 0

        chat_history = []


        # Prompt for first question

        prompt = f"""
You are NeuraChat AI Exam Mode.

The student wants to take an exam.

Subject / Topic:
{exam_topic}

Total Questions:
{exam_total_questions}

This is question number 1.

Rules:

- Ask ONLY one question.
- Do not give the answer.
- Do not explain the answer yet.
- Wait for the student's answer.
- Questions should be suitable for a student.
- Mix conceptual and practical questions when appropriate.
- Keep the question clear.
- Use the same language as the student's topic/request.
- Number the question as Question 1.

Start the exam now.
"""


        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        reply = response.text


        return jsonify({
            "response": reply,
            "exam": True,
            "question_number": exam_current_question,
            "total_questions": exam_total_questions,
            "score": exam_score
        })


    except Exception as e:

        print(
            "EXAM START ERROR:",
            str(e),
            flush=True
        )

        return jsonify({
            "response":
            "⚠️ Exam सुरू करताना problem आली. Please try again."
        })


# =====================================================
# END EXAM
# =====================================================

@app.route("/end_exam", methods=["POST"])
def end_exam():

    global exam_mode
    global exam_started
    global exam_topic
    global exam_current_question
    global exam_score

    result = {
        "response":
        f"📝 Exam समाप्त झाला!\n\n"
        f"📚 Topic: {exam_topic}\n"
        f"📊 Score: {exam_score}/{exam_total_questions}\n\n"
        f"🎉 Well done!"
    }


    exam_mode = False
    exam_started = False
    exam_topic = ""
    exam_current_question = 0
    exam_score = 0


    return jsonify(result)


# =====================================================
# AI RESPONSE
# =====================================================

@app.route("/get_response", methods=["POST"])
def get_response():

    global chat_history

    global exam_mode
    global exam_topic
    global exam_total_questions
    global exam_current_question
    global exam_score
    global exam_started


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
        # EXAM MODE
        # =================================================

        if exam_mode and exam_started and user_message:

            # ---------------------------------------------
            # Save student answer
            # ---------------------------------------------

            answer_prompt = f"""
You are NeuraChat AI Exam Evaluator.

Exam Topic:
{exam_topic}

Total Questions:
{exam_total_questions}

Current Question Number:
{exam_current_question}

The student has submitted this answer:

{user_message}

Evaluate the student's answer.

Rules:

1. Decide whether the answer is correct, partially correct, or incorrect.
2. Give a short explanation.
3. If correct, say "✅ Correct".
4. If partially correct, say "🟡 Partially Correct".
5. If incorrect, say "❌ Incorrect".
6. Do NOT be overly strict with wording.
7. Focus on the meaning of the answer.
8. After evaluation, generate the NEXT question.
9. Do not reveal the next answer.
10. Keep the next question suitable for the topic.
11. Use the same language as the student.

Your response must have this structure:

Result:
[Correct / Partially Correct / Incorrect]

Explanation:
[Short explanation]

Next Question:
[Next question]
"""


            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=answer_prompt
            )


            reply = response.text


            # ---------------------------------------------
            # Determine score using AI result
            # ---------------------------------------------

            lower_reply = reply.lower()


            if (
                "result:" in lower_reply
                and "correct" in lower_reply
                and "incorrect" not in lower_reply
                and "partially" not in lower_reply
            ):

                exam_score += 1


            elif "result:" in lower_reply:

                if (
                    "partially correct" not in lower_reply
                    and "incorrect" not in lower_reply
                    and "correct" in lower_reply
                ):

                    exam_score += 1


            # ---------------------------------------------
            # Move to next question
            # ---------------------------------------------

            exam_current_question += 1


            # ---------------------------------------------
            # Finish exam
            # ---------------------------------------------

            if exam_current_question > exam_total_questions:

                final_prompt = f"""
The exam is finished.

Topic:
{exam_topic}

Total Questions:
{exam_total_questions}

Student Score:
{exam_score}

Create a short final result for the student.

Include:

📝 Exam Completed
📚 Topic
📊 Score
📈 Percentage
💬 Short encouraging feedback

Do not create another question.
"""


                final_response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=final_prompt
                )


                final_reply = final_response.text


                exam_mode = False
                exam_started = False


                return jsonify({

                    "response":
                    reply
                    + "\n\n"
                    + "━━━━━━━━━━━━━━━━━━\n\n"
                    + final_reply,

                    "exam": True,
                    "finished": True,
                    "score": exam_score,
                    "total_questions":
                    exam_total_questions

                })


            # ---------------------------------------------
            # Continue exam
            # ---------------------------------------------

            return jsonify({

                "response": reply,

                "exam": True,

                "question_number":
                exam_current_question,

                "total_questions":
                exam_total_questions,

                "score":
                exam_score

            })


        # =================================================
        # STORE NORMAL USER MESSAGE
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
        # AI PROMPT
        # =================================================

        conversation_text = "\n".join(
            chat_history
        )


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
- Use emojis only when they fit naturally.
- If you don't know something, say so honestly.

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
        # IMAGE REQUEST
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


            if user_message:

                image_prompt = f"""
{prompt}

The user has uploaded an image.

User's question:

{user_message}

Analyze the uploaded image carefully and answer the user's question.
"""


            else:

                image_prompt = f"""
{prompt}

The user has uploaded an image.

Analyze the uploaded image carefully and describe what you can see.
"""


            response = client.models.generate_content(

                model="gemini-3.6-flash",

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

                model="gemini-3.6-flash",

                contents=prompt

            )


        # =================================================
        # GET RESPONSE TEXT
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


        if (
            "401" in error_message
            or "UNAUTHENTICATED" in error_message
            or "API key" in error_message
            or "authentication" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini API key authentication problem आहे. "
                "कृपया API key तपासा."
            )


        elif (
            "404" in error_message
            or "NOT_FOUND" in error_message
            or "not found" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini model उपलब्ध नाही. "
                "कृपया Render Logs तपासा."
            )


        elif (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
            or "quota" in error_message.lower()
        ):

            reply = (
                "⚠️ Gemini API ची usage limit पूर्ण झाली आहे. "
                "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
            )


        elif (
            "503" in error_message
            or "UNAVAILABLE" in error_message
        ):

            reply = (
                "⚠️ Gemini service सध्या busy आहे. "
                "कृपया काही सेकंदांनी पुन्हा प्रयत्न करा."
            )


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
