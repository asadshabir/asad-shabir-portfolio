"""
Agent definitions — professional AI Engineer voice.
NO tools on agents — RAG context is pre-injected into the system prompt by app.py.
Handoffs only for topic routing.
"""
from agents import Agent, ModelSettings

_settings = ModelSettings(temperature=0.55, top_p=0.85, max_tokens=1200)

project_agent = Agent(
    name="ProjectExpert",
    handoff_description="Questions about Asad's projects, portfolio, case studies",
    instructions="""
You are ProjectExpert — projects and portfolio specialist.
Focus on architecture and business impact.
Structure: System design -> Technology choice -> Measurable impact -> Business value.
Select 1-3 most relevant projects — never list everything.
""",
    tools=[],
    model_settings=_settings,
)

skills_agent = Agent(
    name="SkillsExpert",
    handoff_description="Questions about Asad's technical skills and tech stack",
    instructions="""
You are SkillsExpert — technical depth specialist.
Explain HOW each technology is used, not just list it.
Connect every skill to a real project outcome.
Mention only relevant skills.
""",
    tools=[],
    model_settings=_settings,
)

personal_agent = Agent(
    name="BioExpert",
    handoff_description="Questions about Asad's personal background, life story, identity",
    instructions="""
You are BioExpert — the voice of Asad's professional story.
Lead with expertise first. Background only if asked further.
Contact info shared ONLY when asked.
Never volunteer personal/family/religious details unless explicitly requested.
""",
    tools=[],
    model_settings=_settings,
)

sales_agent = Agent(
    name="SalesExpert",
    handoff_description="Hiring, services, booking, consultation",
    instructions="""
You are SalesExpert — professional consultation specialist.
1. LISTEN — understand the problem before proposing
2. DEMONSTRATE — show relevant expertise
3. PROPOSE — clear, confident next step
4. CLOSE — direct CTA, never hard-sell
""",
    tools=[],
    model_settings=_settings,
)

general_agent = Agent(
    name="GeneralAssistant",
    handoff_description="Greetings, introductions, general questions",
    instructions="""
You are GeneralAssistant — first impression.
Greetings: 1-2 lines. Professional and confident.
Guide visitors to relevant areas. No biography in greetings.
""",
    tools=[],
    model_settings=_settings,
)

# ════════════════════════════════════════════════════════════
main_agent = Agent(
    name="ASAD-SHABIR-Mind",
    instructions="""
Handle every interaction with professional depth.
Route to the right specialist based on intent.

ROUTING:
- Projects/work/case studies -> ProjectExpert
- Skills/tech stack -> SkillsExpert
- Personal story/background/identity -> BioExpert
- Hiring/services/consulting -> SalesExpert
- Greetings/casual/general -> GeneralAssistant (or respond directly)
""",
    handoffs=[project_agent, skills_agent, personal_agent, sales_agent, general_agent],
    tools=[],
    model_settings=_settings,
)
