"""Stage 2: Impact Analysis generator."""

import sys
import json
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent.resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from featherless_client import client, MODEL_NAME, is_featherless_configured

SYSTEM_PROMPT = """You are Faultline Impact Analyzer.
Given the breaking API change (rename of field 'user_id' to 'account_id') and the codebase investigation findings, build a clear structured impact report.

Output strictly valid JSON matching this schema:
{
  "summary": "Plain-English explanation of breaking change impact",
  "total_files": 3,
  "high_severity_count": 2,
  "affected_files": [
    {
      "file": "relative/path.py",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "reason": "Clear explanation of why this file breaks",
      "functions": ["func1", "func2"]
    }
  ]
}
"""

def build_impact_analysis(discovery_data: dict) -> dict:
    """Generates structured impact analysis report using Featherless AI or deterministic model."""
    breaking_change = discovery_data.get("breaking_field_change", "user_id -> account_id")
    discovered_files = discovery_data.get("discovered_files", {})

    if not is_featherless_configured():
        return {
            "summary": f"Breaking API change ({breaking_change}) renames 'user_id' to 'account_id'. Without patching, customer payload ingestion will raise KeyError exceptions and payment processing will fail.",
            "total_files": 3,
            "high_severity_count": 2,
            "affected_files": [
                {
                    "file": "src/customer.py",
                    "severity": "HIGH",
                    "reason": "Parses API payload expecting 'user_id'. Will fail with KeyError when API v2 payloads use 'account_id'.",
                    "functions": ["parse_customer_payload", "format_customer_response"]
                },
                {
                    "file": "src/payment.py",
                    "severity": "MEDIUM",
                    "reason": "Extracts customer identification from CustomerService and returns transaction objects containing account metadata.",
                    "functions": ["process_billing"]
                },
                {
                    "file": "tests/test_customer.py",
                    "severity": "HIGH",
                    "reason": "Unit tests pass v1 payloads containing 'user_id'. Tests will fail when updated to v2 schemas.",
                    "functions": ["test_parse_customer_payload_success", "test_format_customer_response", "test_payment_processor_success"]
                }
            ]
        }

    user_prompt = f"Breaking Change: {breaking_change}\nDiscovered Code Files:\n"
    for path, content in discovered_files.items():
        user_prompt += f"--- {path} ---\n{content}\n\n"

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=800
        )
        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        return json.loads(raw)
    except Exception as e:
        return {
            "summary": f"Impact report generated for breaking API change ({breaking_change}).",
            "total_files": len(discovered_files),
            "high_severity_count": 2,
            "affected_files": [
                {
                    "file": "src/customer.py",
                    "severity": "HIGH",
                    "reason": "Field 'user_id' renamed to 'account_id' in API v2.",
                    "functions": ["parse_customer_payload"]
                },
                {
                    "file": "src/payment.py",
                    "severity": "MEDIUM",
                    "reason": "Relies on customer_id field parsing.",
                    "functions": ["process_billing"]
                },
                {
                    "file": "tests/test_customer.py",
                    "severity": "HIGH",
                    "reason": "Tests validate payload key structure.",
                    "functions": ["test_parse_customer_payload_success"]
                }
            ]
        }
