from typing import Dict

LEGAL_TEMPLATES: Dict[str, str] = {
    "summary": """
        Summarize the following legal judgment or text. 
        Structure the summary with the following headers:
        - Case Name & Citation (if available)
        - Key Facts
        - Principal Legal Issues
        - Court's Holding and Reasoning
        - Conclusion/Impact
    """,
    "petition": """
        Draft a formal legal petition for the High Court based on the provided facts.
        Structure the petition as follows:
        - PETITION TITLE
        - FACTS OF THE CASE (Sequential and numbered)
        - GROUNDS FOR PETITION (Legal arguments and precedents)
        - PRAYER FOR RELIEF (Specifically what is being asked of the court)
        - VERIFICATION
    """,
    "notice": """
        Draft a formal Legal Notice to be sent to the opposing party.
        Include:
        - Sender's identification
        - Clear statement of facts
        - Legal basis for the demand
        - Specific time frame for compliance (e.g., 15 days)
        - Warning of legal action if not complied with.
    """
}

def get_template(template_name: str) -> str:
    return LEGAL_TEMPLATES.get(template_name, "Provide a formal legal analysis of the following:")
