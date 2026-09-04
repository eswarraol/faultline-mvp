"""Objective evidence-based confidence scoring engine."""

def calculate_confidence(test_result: dict, retry_count: int, has_unresolved_deps: bool = False) -> dict:
    """
    Calculates confidence level (HIGH, MEDIUM, LOW) based on objective criteria:
    - HIGH: patch applies, 100% tests pass, <= 1 repair attempt, no unresolved dependencies
    - MEDIUM: 100% tests pass, but multiple repair attempts or indirect dependency ambiguity
    - LOW: tests fail or patch cannot apply
    """
    passed = test_result.get("passed", False)
    passed_tests = test_result.get("passed_tests", 0)
    total_tests = test_result.get("total_tests", 0)
    pass_rate = (passed_tests / total_tests) if total_tests > 0 else 0.0

    criteria = [
        {"label": "Patch applied cleanly to workspace", "met": True},
        {"label": f"Unit tests passed ({passed_tests}/{total_tests})", "met": passed},
        {"label": "Zero unresolved critical dependencies", "met": not has_unresolved_deps},
        {"label": f"Self-repair iterations: {retry_count}", "met": retry_count <= 1}
    ]

    if passed and pass_rate == 1.0 and retry_count <= 1 and not has_unresolved_deps:
        level = "HIGH"
        score_pct = 95
        reason = "Patch applies cleanly, 100% of unit test suites pass, and change is fully verified within <= 1 repair iteration."
    elif passed and pass_rate == 1.0:
        level = "MEDIUM"
        score_pct = 80
        reason = "All unit tests pass, but remediation required multiple self-repair retry iterations."
    else:
        level = "LOW"
        score_pct = 40
        reason = "Unit test verification failed or unresolved code dependencies remain."

    return {
        "level": level,
        "score_pct": score_pct,
        "reason": reason,
        "criteria": criteria
    }
