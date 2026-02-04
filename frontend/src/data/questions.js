export const QUESTIONS = {
    goal_primary: {
        label: "Why are you exploring opportunities on Frantiger right now?",
        options: [
            "I want to invest capital and earn returns",
            "I want to own and actively run a business",
            "I want semi passive income that grows over time",
            "I want to explore sectors before bigger bets",
            "I am a consultant or broker looking for deals"
        ]
    },
    time_horizon: {
        label: "How long are you willing to stay invested before expecting strong returns?",
        options: ["Less than 2 years", "2-4 years", "4-7 years", "More than 7 years"]
    },
    ticket_size: {
        label: "What total amount are you comfortable deploying per opportunity?",
        options: ["Up to ₹5 lakh", "₹5-15 lakh", "₹15-50 lakh", "₹50 lakh-₹2 crore", "Above ₹2 crore"]
    },
    risk_tolerance: {
        label: "When it comes to business risk, where do you naturally sit?",
        type: "slider",
        min: 1,
        max: 5,
        help: "1 = Stable and predictable | 5 = High risk, high upside"
    },
    reaction_style: {
        label: "If your business reports a bad quarter, what are you most likely to do first?",
        options: [
            "Pause and review numbers calmly",
            "Call the operator or founder to understand",
            "Plan to exit and protect capital",
            "Look at the long term and stay the course"
        ]
    },
    decision_style: {
        label: "How would you describe your decision making style for investments?",
        options: [
            "Very quick, I go with my gut",
            "Fairly quick, once key data is clear",
            "I take my time, I like deep research",
            "I move very slowly and cautiously"
        ]
    },
    involvement_level: {
        label: "How hands on do you want to be in your ideal opportunity?",
        options: [
            "Capital partner - I write the cheque, someone else runs the show",
            "Co pilot - I support and guide, a manager or founder runs it",
            "Operator - I want to be in the driver seat daily"
        ]
    },
    time_per_week: {
        label: "How much time can you realistically give per week?",
        options: ["0-2 hours", "2-5 hours", "5-10 hours", "10-20 hours", "Full time"]
    },
    partner_preference: {
        label: "Who do you prefer to work with the most?",
        options: [
            "A strong brand that already has systems in place",
            "Scrappy founders building systems now",
            "Professional management teams and COOs"
        ]
    },
    customer_segment: {
        label: "Which type of customers do you feel most comfortable dealing with?",
        options: [
            "B2C - consumers, families, walk in users",
            "B2B - companies and institutions",
            "B2G - government and tenders",
            "A mix is fine"
        ]
    },
    brand_preference: {
        label: "If you had to choose, what would you prefer?",
        options: [
            "A well known brand that grows steadily",
            "A lesser known brand with higher upside potential",
            "Depends on the numbers, not the name"
        ]
    },
    experience_level: {
        label: "What best describes your experience so far?",
        options: [
            "I am completely new",
            "I have run a small or mid size business",
            "I have invested in or backed businesses before",
            "I am a seasoned founder, investor or operator"
        ]
    },
    priority_focus: {
        label: "If you had to choose, what comes first for you?",
        options: [
            "People - team, founders, operators",
            "Process - systems, playbooks, controls",
            "Profit - margins, payback, upside"
        ]
    }
}

export const MULTI_OPTIONS = {
    sectors: {
        label: "Which sectors are you genuinely excited about right now?",
        options: [
            "Food and beverage",
            "Education and upskilling",
            "Health and wellness",
            "Retail and lifestyle",
            "Tech and SaaS",
            "Manufacturing and industrial",
            "Services and consulting",
            "I am open if economics are strong"
        ]
    },
    geo_scope: {
        label: "Where are you most interested in investing or operating?",
        options: [
            "Only my city",
            "Within my state",
            "Across India",
            "Open to cross border opportunities"
        ]
    },
    deal_structures: {
        label: "What kind of deal structures appeal to you the most?",
        options: [
            "Single franchise I own and run",
            "Multiple franchises I own with managers",
            "Revenue or profit share deals",
            "Fractional ownership or pooling",
            "I am open to all, show me what is good"
        ]
    },
    non_negotiables: {
        label: "What is absolutely non negotiable for you in any opportunity?",
        options: [
            "Clear unit economics",
            "Strong compliance and legal hygiene",
            "Brand reputation and ethics",
            "Scalable model, not one location only",
            "Skin in the game from founder or brand"
        ]
    }
}
