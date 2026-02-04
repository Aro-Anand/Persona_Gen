"""
Streamlit Frontend for Investor Persona Generator
Interactive UI for testing the AI-powered persona generation
"""

import streamlit as st
import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()


# Configuration
API_BASE_URL = os.getenv("API_BASE_URL")

# Page config
st.set_page_config(
    page_title="Frantiger Investor Persona Generator",
    page_icon="💼",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    /* Global Font & Theme overrides */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Inter', sans-serif;
    }
    
    .stApp {
        background-color: #c0d7ed;
    }

    /* Input Section Headers */
    .section-header {
        color: #1e293b;
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
    }

    /* Persona Tags */
    .persona-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 16px;
        margin: 4px;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        border-radius: 9999px;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
        transition: transform 0.2s;
    }
    
    .persona-tag:hover {
        transform: translateY(-2px);
    }

    /* Result Cards */
    .result-card-content {
        font-size: 0.95rem;
        color: #334155;
    }

    .strength-card {
        background-color: #ffffff;
        border: 1px solid #bbf7d0;
        border-left: 5px solid #22c55e;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 0.8rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .consideration-card {
        background-color: #ffffff;
        border: 1px solid #fde68a;
        border-left: 5px solid #f59e0b;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 0.8rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .opportunity-card {
        background-color: #ffffff;
        border: 1px solid #bfdbfe;
        border-left: 5px solid #3b82f6;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 0.8rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    /* Summary Box */
    .summary-box {
        background: linear-gradient(to right, #ffffff, #f8fafc);
        border: 1px solid #e2e8f0;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 6px solid #4f46e5;
        margin-bottom: 1.5rem;
    }
</style>
""", unsafe_allow_html=True)

# Quiz question definitions
QUESTIONS = {
    "goal_primary": {
        "label": "Why are you exploring opportunities on Frantiger right now?",
        "options": [
            "I want to invest capital and earn returns",
            "I want to own and actively run a business",
            "I want semi passive income that grows over time",
            "I want to explore sectors before bigger bets",
            "I am a consultant or broker looking for deals"
        ]
    },
    "time_horizon": {
        "label": "How long are you willing to stay invested before expecting strong returns?",
        "options": ["Less than 2 years", "2-4 years", "4-7 years", "More than 7 years"]
    },
    "ticket_size": {
        "label": "What total amount are you comfortable deploying per opportunity?",
        "options": ["Up to ₹5 lakh", "₹5-15 lakh", "₹15-50 lakh", "₹50 lakh-₹2 crore", "Above ₹2 crore"]
    },
    "reaction_style": {
        "label": "If your business reports a bad quarter, what are you most likely to do first?",
        "options": [
            "Pause and review numbers calmly",
            "Call the operator or founder to understand",
            "Plan to exit and protect capital",
            "Look at the long term and stay the course"
        ]
    },
    "decision_style": {
        "label": "How would you describe your decision making style for investments?",
        "options": [
            "Very quick, I go with my gut",
            "Fairly quick, once key data is clear",
            "I take my time, I like deep research",
            "I move very slowly and cautiously"
        ]
    },
    "involvement_level": {
        "label": "How hands on do you want to be in your ideal opportunity?",
        "options": [
            "Capital partner - I write the cheque, someone else runs the show",
            "Co pilot - I support and guide, a manager or founder runs it",
            "Operator - I want to be in the driver seat daily"
        ]
    },
    "time_per_week": {
        "label": "How much time can you realistically give per week?",
        "options": ["0-2 hours", "2-5 hours", "5-10 hours", "10-20 hours", "Full time"]
    },
    "partner_preference": {
        "label": "Who do you prefer to work with the most?",
        "options": [
            "A strong brand that already has systems in place",
            "Scrappy founders building systems now",
            "Professional management teams and COOs"
        ]
    },
    "customer_segment": {
        "label": "Which type of customers do you feel most comfortable dealing with?",
        "options": [
            "B2C - consumers, families, walk in users",
            "B2B - companies and institutions",
            "B2G - government and tenders",
            "A mix is fine"
        ]
    },
    "brand_preference": {
        "label": "If you had to choose, what would you prefer?",
        "options": [
            "A well known brand that grows steadily",
            "A lesser known brand with higher upside potential",
            "Depends on the numbers, not the name"
        ]
    },
    "experience_level": {
        "label": "What best describes your experience so far?",
        "options": [
            "I am completely new",
            "I have run a small or mid size business",
            "I have invested in or backed businesses before",
            "I am a seasoned founder, investor or operator"
        ]
    },
    "priority_focus": {
        "label": "If you had to choose, what comes first for you?",
        "options": [
            "People - team, founders, operators",
            "Process - systems, playbooks, controls",
            "Profit - margins, payback, upside"
        ]
    }
}

MULTI_OPTIONS = {
    "sectors": [
        "Food and beverage",
        "Education and upskilling",
        "Health and wellness",
        "Retail and lifestyle",
        "Tech and SaaS",
        "Manufacturing and industrial",
        "Services and consulting",
        "I am open if economics are strong"
    ],
    "geo_scope": [
        "Only my city",
        "Within my state",
        "Across India",
        "Open to cross border opportunities"
    ],
    "deal_structures": [
        "Single franchise I own and run",
        "Multiple franchises I own with managers",
        "Revenue or profit share deals",
        "Fractional ownership or pooling",
        "I am open to all, show me what is good"
    ],
    "non_negotiables": [
        "Clear unit economics",
        "Strong compliance and legal hygiene",
        "Brand reputation and ethics",
        "Scalable model, not one location only",
        "Skin in the game from founder or brand"
    ]
}

def main():
    # Custom Header
    st.markdown("""
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="color: #1e293b; font-weight: 800; font-size: 3rem; margin-bottom: 0.5rem;">Frantiger</h1>
            <p style="color: #64748b; font-size: 1.2rem; font-weight: 500;">AI-Powered Investor Persona Generator</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Sidebar for mode selection
    with st.sidebar:
        st.header("⚙️ Settings")
        mode = st.radio(
            "Generation Mode",
            ["AI-Powered (Full)", "Rule-Based (Basic)", "Hybrid (Both)"],
            help="AI mode provides detailed insights, Rule-based is faster"
        )
        
        st.markdown("---")
        st.markdown("**About this tool:**")
        st.info("""
        This demo uses OpenAI (with Gemini/Claude fallback) to analyze your quiz responses and generate 
        a comprehensive investor persona tailored to the Frantiger platform.
        """)
    
    # Create tabs
    tab1, tab2 = st.tabs(["📋 Quiz", "🎯 Results"])
    
    with tab1:
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Initialize session state
        if 'quiz_answers' not in st.session_state:
            st.session_state.quiz_answers = {}
        
        # Render quiz questions in cards
        col1, col2 = st.columns(2, gap="large")
        
        with col1:
            with st.container(border=True):
                st.markdown('<div class="section-header">🎯 Goals & Preferences</div>', unsafe_allow_html=True)
                
                for key in ["goal_primary", "time_horizon", "ticket_size", "involvement_level", "time_per_week"]:
                    if key in QUESTIONS:
                        st.session_state.quiz_answers[key] = st.selectbox(
                            QUESTIONS[key]["label"],
                            options=QUESTIONS[key]["options"],
                            key=f"q_{key}"
                        )
                
                st.markdown("---")
                # Risk tolerance slider
                st.session_state.quiz_answers["risk_tolerance"] = st.slider(
                    "When it comes to business risk, where do you naturally sit?",
                    min_value=1,
                    max_value=5,
                    value=3,
                    help="1 = Stable and predictable | 5 = High risk, high upside"
                )
                st.caption("Lower = Safer, Higher = More Aggressive")
        
        with col2:
            with st.container(border=True):
                st.markdown('<div class="section-header">🤝 Style & Experience</div>', unsafe_allow_html=True)
                
                for key in ["reaction_style", "decision_style", "partner_preference", "customer_segment", "brand_preference", "experience_level", "priority_focus"]:
                    if key in QUESTIONS:
                        st.session_state.quiz_answers[key] = st.selectbox(
                            QUESTIONS[key]["label"],
                            options=QUESTIONS[key]["options"],
                            key=f"q_{key}"
                        )
        
        # Multi-select questions
        st.markdown("<br>", unsafe_allow_html=True)
        col3, col4 = st.columns(2, gap="large")
        
        with col3:
            with st.container(border=True):
                st.markdown('<div class="section-header">🎨 Sectors & Geography</div>', unsafe_allow_html=True)
                st.session_state.quiz_answers["sectors"] = st.multiselect(
                    "Which sectors are you genuinely excited about right now?",
                    options=MULTI_OPTIONS["sectors"]
                )
                
                st.session_state.quiz_answers["geo_scope"] = st.multiselect(
                    "Where are you most interested in investing or operating?",
                    options=MULTI_OPTIONS["geo_scope"]
                )
        
        with col4:
            with st.container(border=True):
                st.markdown('<div class="section-header">🏗️ Structures & Non-Negotiables</div>', unsafe_allow_html=True)
                st.session_state.quiz_answers["deal_structures"] = st.multiselect(
                    "What kind of deal structures appeal to you the most?",
                    options=MULTI_OPTIONS["deal_structures"]
                )
                
                st.session_state.quiz_answers["non_negotiables"] = st.multiselect(
                    "What is absolutely non-negotiable for you?",
                    options=MULTI_OPTIONS["non_negotiables"]
                )
        
        # Key lesson text area
        st.markdown("<br>", unsafe_allow_html=True)
        with st.container(border=True):
            st.markdown('<div class="section-header">📝 Your Unique Insights</div>', unsafe_allow_html=True)
            st.session_state.quiz_answers["key_lesson"] = st.text_area(
                "What is one lesson you never want to forget from past business or investment experience?",
                placeholder="Example: Never enter a business where I do not trust the numbers or the people.",
                height=100
            )
        
        # Generate button
        st.markdown("---")
        if st.button("🚀 Generate My Investor Persona", type="primary", use_container_width=True):
            with st.spinner("Analyzing your profile with AI..."):
                # Determine endpoint
                if mode == "AI-Powered (Full)":
                    endpoint = f"{API_BASE_URL}/generate-persona"
                elif mode == "Rule-Based (Basic)":
                    endpoint = f"{API_BASE_URL}/generate-persona/basic"
                else:
                    endpoint = f"{API_BASE_URL}/generate-persona/hybrid"
                
                try:
                    response = requests.post(
                        endpoint,
                        json=st.session_state.quiz_answers
                    )
                    
                    if response.status_code == 200:
                        st.session_state.persona_result = response.json()
                        st.session_state.generation_mode = mode
                        st.success("✅ Persona generated successfully!")
                        st.info("👉 Check the **Results** tab to view your investor persona")
                    else:
                        st.error(f"Error: {response.json().get('detail', 'Unknown error')}")
                        
                except requests.exceptions.ConnectionError:
                    st.error("❌ Cannot connect to API. Make sure the backend is running on port 8000.")
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
    
    with tab2:
        if 'persona_result' in st.session_state:
            result = st.session_state.persona_result
            
            st.markdown(f"### 🎯 Your Investor Persona")
            st.caption(f"Generated using: {st.session_state.generation_mode}")
            
            # Display based on mode
            if st.session_state.generation_mode == "Hybrid (Both)":
                # Show both AI and rule-based
                st.markdown("#### 🤖 AI-Generated Persona")
                display_full_persona(result.get("ai_persona", {}))
                
                st.markdown("---")
                st.markdown("#### 📊 Rule-Based Tags")
                display_tags(result.get("rule_based_tags", []))
                
            elif "persona_summary" in result:
                # Full AI persona
                display_full_persona(result)
            else:
                # Basic tags only
                st.markdown("#### 📊 Your Persona Tags")
                display_tags(result.get("persona_tags", []))
            
            # Export options
            st.markdown("---")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.download_button(
                    label="📥 Download JSON",
                    data=json.dumps(result, indent=2),
                    file_name=f"investor_persona_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json"
                )
            
            with col2:
                if st.button("🔄 Generate New Persona"):
                    del st.session_state.persona_result
                    st.rerun()
            
            with col3:
                if st.button("📋 Copy to Clipboard"):
                    st.code(json.dumps(result, indent=2), language="json")
        
        else:
            st.info("👈 Complete the quiz and click 'Generate My Investor Persona' to see results here.")

def display_tags(tags):
    """Display persona tags with styling"""
    tag_html = " ".join([f'<span class="persona-tag">{tag}</span>' for tag in tags])
    st.markdown(tag_html, unsafe_allow_html=True)

def display_full_persona(persona):
    """Display full AI-generated persona"""
    
    # Header with tags
    st.markdown("### 🏷️ Persona Profile")
    display_tags(persona.get("persona_tags", []))
    st.markdown("") # Spacing
    
    # Summary Box
    st.markdown(f"""
        <div class="summary-box">
            <h4 style="margin-top:0; color:#0c0b0d;">📝 Executive Summary</h4>
            <p style="font-size:1.05rem; line-height:1.6;">{persona.get("persona_summary", "No summary available")}</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Investment Style
    with st.container(border=True):
        st.markdown("#### 💡 Investment Style")
        st.write(persona.get("investment_style", "No investment style available"))
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Two column layout for Strengths & Considerations
    col1, col2 = st.columns(2, gap="medium")
    
    with col1:
        st.markdown("#### 💪 Core Strengths")
        for strength in persona.get("strengths", []):
            st.markdown(f"""
                <div class="strength-card">
                    <div style="font-weight:600; color:#15803d; margin-bottom:4px;">Strength</div>
                    <div class="result-card-content">{strength}</div>
                </div>
            """, unsafe_allow_html=True)
            
        st.markdown("#### 🎯 Best Opportunities")
        for rec in persona.get("recommended_opportunities", []):
             st.markdown(f"""
                <div class="opportunity-card">
                    <div style="font-weight:600; color:#1d4ed8; margin-bottom:4px;">Recommendation</div>
                    <div class="result-card-content">{rec}</div>
                </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### ⚠️ Key Considerations")
        for consideration in persona.get("considerations", []):
            st.markdown(f"""
                <div class="consideration-card">
                    <div style="font-weight:600; color:#b45309; margin-bottom:4px;">Watch Out For</div>
                    <div class="result-card-content">{consideration}</div>
                </div>
            """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()