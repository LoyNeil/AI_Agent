import traceback

from dotenv import load_dotenv
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

print("OPENAI_API_KEY =>", bool(os.getenv("OPENAI_API_KEY")))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
### SOP OUTPUT RULES
- Write in clear, professional, structured prose — tone must reflect a trained process designer.
- Bold all main headings and subheadings.
- Do **not** invent steps, roles, or decisions not supported by the transcript.

### SOP STRUCTURE (LOCKED)
The SOP must contain these sections in this exact order:

**Purpose**  
**Scope**  
**Roles & Responsibilities**  
**Prerequisites**  
**Start and End States**  
**Step-by-Step Workflow**

No additional sections are allowed.

### STEP-BY-STEP WORKFLOW RULES
Each workflow step must be titled as **Step 1 – [Step Title]**, **Step 1.1 - [Step Title],**Step 2 – [Step Title]**, etc.

Each step includes these bolded subheadings (light indenting acceptable):
- **Action:** Detailed description of the activity.  
- **Outcome or Decision:** Describe the result or decision made.  
- **Happy Path:** Explain the successful or expected outcome. Include the next step reference in parentheses, for example: “Continue to **Step 4 – Validate Request Details**.”  
- **Unhappy Path:** Explain what occurs if the step fails or requires rework, and clearly reference the next applicable step in parentheses, for example: “Return to **Step 2 – Review and Correct Data**.”  
- **Handoffs:** Identify any transitions between roles.

The step references in Happy and Unhappy Paths are required to provide traceability for reviewers and easy process validation.
"""

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate-sop")
async def generate_sop(file: UploadFile = File(...), prompt: str = ""):
    raw = await file.read()

    try:
        transcript_text = raw.decode("utf-8", errors="ignore")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not decode file. Please upload a .txt transcript.")

    if not transcript_text.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty.")

    user_prompt = prompt.strip() if prompt else "Create an SOP from this transcript."
    full_input = f"{user_prompt}\n\n--- TRANSCRIPT START ---\n{transcript_text}\n--- TRANSCRIPT END ---"


    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": full_input},
            ],
        )
        sop_text = resp.output_text
    except Exception as e:
        #print("FULL ERROR")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

   
    return {"sop": sop_text, "filename": file.filename}