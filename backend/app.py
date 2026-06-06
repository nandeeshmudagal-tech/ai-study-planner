from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Study Planner Python backend is running"})

@app.route("/save-plan", methods=["POST"])
def save_plan():
    data = request.json

    result = supabase.table("study_plans").insert({
        "subject_name": data["subject_name"],
        "deadline": data["deadline"],
        "difficulty": data["difficulty"],
        "confidence": data["confidence"],
        "study_hours": data["study_hours"]
    }).execute()

    return jsonify({
        "message": "Plan saved successfully",
        "data": result.data
    })

@app.route("/plans", methods=["GET"])
def get_plans():
    result = supabase.table("study_plans").select("*").order("created_at", desc=True).execute()

    return jsonify({
        "message": "Plans retrieved successfully",
        "data": result.data
    })

if __name__ == "__main__":
    app.run(debug=True)