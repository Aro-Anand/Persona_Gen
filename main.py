"""
AI-Powered Investor Persona Generation API
Uses OpenAI (with Gemini and Claude fallback) to generate nuanced investor personas from quiz responses
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import anthropic
import openai
from google import genai
import os
from datetime import datetime
import json
from dotenv import load_dotenv
from prompt import PERSONA_GENERATION_PROMPT
import warnings

# Suppress Pydantic warnings from third-party libraries (like google-genai)
warnings.filterwarnings("ignore", message='Field name ".*" shadows an attribute in parent "Operation"')

load_dotenv()

app = FastAPI(title="Investor Persona Generator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# OpenAI Client
if os.environ.get("OPENAI_API_KEY"):
    openai_client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
else:
    openai_client = None

# Google Gemini Configuration
if os.environ.get("GOOGLE_API_KEY"):
    gemini_client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))
else:
    gemini_client = None

# Anthropic Client
if os.environ.get("ANTHROPIC_API_KEY"):
    claude_client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
else:
    claude_client = None

# Request Models
class QuizAnswers(BaseModel):
    goal_primary: Optional[str] = None
    time_horizon: Optional[str] = None
    ticket_size: Optional[str] = None
    risk_tolerance: Optional[int] = Field(None, ge=1, le=5)
    reaction_style: Optional[str] = None
    decision_style: Optional[str] = None
    involvement_level: Optional[str] = None
    time_per_week: Optional[str] = None
    partner_preference: Optional[str] = None
    sectors: Optional[List[str]] = None
    customer_segment: Optional[str] = None
    brand_preference: Optional[str] = None
    geo_scope: Optional[List[str]] = None
    deal_structures: Optional[List[str]] = None
    non_negotiables: Optional[List[str]] = None
    experience_level: Optional[str] = None
    key_lesson: Optional[str] = None
    priority_focus: Optional[str] = None

class PersonaResponse(BaseModel):
    persona_tags: List[str]
    persona_summary: str
    investment_style: str
    strengths: List[str]
    considerations: List[str]
    recommended_opportunities: List[str]
    generated_at: str

# Persona Generation Prompt

def generate_persona_with_openai(prompt: str) -> PersonaResponse:
    """Generate persona using OpenAI GPT-4"""
    if not openai_client:
        raise Exception("OpenAI API Key not configured")
        
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert investment advisor."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return PersonaResponse(**data, generated_at=datetime.utcnow().isoformat())
    except Exception as e:
        raise Exception(f"OpenAI Error: {str(e)}")

def generate_persona_with_gemini(prompt: str) -> PersonaResponse:
    """Generate persona using Google Gemini"""
    if not gemini_client:
        raise Exception("Google API Key not configured")
    
    try:
        # Gemini sometimes adds markdown code blocks, so we might need to clean it
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        text = response.text
        
        # Clean potential markdown formatting
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text.strip())
        return PersonaResponse(**data, generated_at=datetime.utcnow().isoformat())
    except Exception as e:
        raise Exception(f"Gemini Error: {str(e)}")

def generate_persona_with_claude(prompt: str) -> PersonaResponse:
    """Generate persona using Anthropic Claude"""
    if not claude_client:
        raise Exception("Anthropic API Key not configured")

    try:
        message = claude_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        response_text = message.content[0].text
        data = json.loads(response_text)
        return PersonaResponse(**data, generated_at=datetime.utcnow().isoformat())
    except Exception as e:
        raise Exception(f"Claude Error: {str(e)}")

def generate_persona_with_ai(answers: QuizAnswers) -> PersonaResponse:
    """
    Generate investor persona using AI with fallbacks:
    1. OpenAI (Primary)
    2. Gemini (First Fallback)
    3. Claude (Final Fallback)
    """
    
    # Prepare quiz data for the prompt
    quiz_dict = answers.model_dump(exclude_none=True)
    quiz_data = json.dumps(quiz_dict, indent=2)
    formatted_prompt = PERSONA_GENERATION_PROMPT.format(quiz_data=quiz_data)
    
    errors = []
    
    # 1. Try OpenAI
    try:
        print("Attempting generation with OpenAI...")
        return generate_persona_with_openai(formatted_prompt)
    except Exception as e:
        print(f"OpenAI failed: {e}")
        errors.append(f"OpenAI: {str(e)}")
        
    # 2. Try Gemini
    try:
        print("Attempting generation with Gemini (Fallback 1)...")
        return generate_persona_with_gemini(formatted_prompt)
    except Exception as e:
        print(f"Gemini failed: {e}")
        errors.append(f"Gemini: {str(e)}")
        
    # 3. Try Claude
    try:
        print("Attempting generation with Claude (Fallback 2)...")
        return generate_persona_with_claude(formatted_prompt)
    except Exception as e:
        print(f"Claude failed: {e}")
        errors.append(f"Claude: {str(e)}")
    
    # If all fail
    raise HTTPException(
        status_code=500,
        detail=f"All AI generation attempts failed. Errors: {'; '.join(errors)}"
    )

def generate_persona_rules_based(answers: QuizAnswers) -> List[str]:
    """Fallback: Generate basic persona tags using rules"""
    tags = []
    
    # Risk tolerance
    if answers.risk_tolerance:
        if answers.risk_tolerance <= 2:
            tags.append('Low risk, stable')
        elif answers.risk_tolerance == 3:
            tags.append('Mid risk - balanced')
        elif answers.risk_tolerance >= 4:
            tags.append('High risk, high upside')
    
    # Involvement level
    if answers.involvement_level:
        if 'Capital partner' in answers.involvement_level:
            tags.append('Capital partner')
        elif 'Co pilot' in answers.involvement_level:
            tags.append('Hands-on hybrid')
        elif 'Operator' in answers.involvement_level:
            tags.append('Active operator')
    
    # Time horizon
    if answers.time_horizon:
        if 'Less than 2' in answers.time_horizon:
            tags.append('Short term')
        elif '2-4' in answers.time_horizon:
            tags.append('Medium term')
        else:
            tags.append('Long term')
    
    # Customer segment
    if answers.customer_segment:
        if 'B2C' in answers.customer_segment:
            tags.append('B2C focused')
        if 'B2B' in answers.customer_segment:
            tags.append('B2B focused')
    
    # Experience
    if answers.experience_level:
        if 'new' in answers.experience_level.lower():
            tags.append('New investor')
        elif 'seasoned' in answers.experience_level.lower() or 'small or mid' in answers.experience_level.lower():
            tags.append('Experienced operator')
    
    # Priority focus
    if answers.priority_focus:
        if 'People' in answers.priority_focus:
            tags.append('People first')
        if 'Process' in answers.priority_focus:
            tags.append('Systems focused')
        if 'Profit' in answers.priority_focus:
            tags.append('Returns driven')
    
    # Remove duplicates and limit to 6
    return list(set(tags))[:6]

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "Investor Persona Generator API",
        "version": "1.0",
        "endpoints": {
            "/generate-persona": "POST - Generate AI-powered investor persona",
            "/generate-persona/basic": "POST - Generate rule-based persona tags only",
            "/health": "GET - Health check"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/generate-persona", response_model=PersonaResponse)
async def generate_full_persona(answers: QuizAnswers):
    """
    Generate comprehensive AI-powered investor persona
    
    This endpoint uses Claude AI to create a detailed, nuanced persona
    based on quiz responses.
    """
    if not os.environ.get("OPENAI_API_KEY") and not os.environ.get("GOOGLE_API_KEY") and not os.environ.get("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="No AI API keys configured (OPENAI_API_KEY, GOOGLE_API_KEY, or ANTHROPIC_API_KEY)"
        )
    
    return generate_persona_with_ai(answers)

@app.post("/generate-persona/basic")
async def generate_basic_persona(answers: QuizAnswers):
    """
    Generate basic persona tags using rule-based logic (fallback)
    
    This is faster and doesn't require AI, but less nuanced.
    """
    tags = generate_persona_rules_based(answers)
    
    return {
        "persona_tags": tags,
        "generated_at": datetime.utcnow().isoformat(),
        "method": "rule-based"
    }

@app.post("/generate-persona/hybrid")
async def generate_hybrid_persona(answers: QuizAnswers):
    """
    Generate persona with both AI and rule-based approaches
    
    Useful for comparison or as a backup strategy.
    """
    try:
        # Try AI first
        ai_persona = generate_persona_with_ai(answers)
        rule_tags = generate_persona_rules_based(answers)
        
        return {
            "ai_persona": ai_persona,
            "rule_based_tags": rule_tags,
            "method": "hybrid"
        }
    except Exception as e:
        # Fallback to rules if AI fails
        rule_tags = generate_persona_rules_based(answers)
        return {
            "persona_tags": rule_tags,
            "error": str(e),
            "method": "rule-based-fallback"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)