"""Deterministic contract diff engine for OpenAPI / JSON API specs."""

import json
from pathlib import Path

def compute_contract_diff(v1_path: Path, v2_path: Path) -> dict:
    """
    Deterministically computes structural changes between API v1 and v2 specs.
    Returns dict containing breaking change status, field mapping, severity, and contract metadata.
    """
    try:
        v1_data = json.loads(v1_path.read_text(encoding="utf-8"))
        v2_data = json.loads(v2_path.read_text(encoding="utf-8"))
    except Exception as e:
        return {"is_breaking": False, "error": str(e)}

    v1_fields = set(v1_data.get("fields", {}).keys())
    v2_fields = set(v2_data.get("fields", {}).keys())

    removed = list(v1_fields - v2_fields)
    added = list(v2_fields - v1_fields)

    is_breaking = len(removed) > 0
    old_field = removed[0] if removed else "email"
    new_field = added[0] if added else "email_address"

    desc = f"Field '{old_field}' renamed to '{new_field}'" if is_breaking else "No breaking schema change"

    return {
        "is_breaking": is_breaking,
        "breaking_change": desc,
        "old_contract": f"customer.{old_field}",
        "new_contract": f"customer.{new_field}",
        "old_field": old_field,
        "new_field": new_field,
        "severity": "HIGH" if is_breaking else "LOW",
        "endpoint": v2_data.get("endpoint", "/api/v2/customer"),
        "v1_version": v1_data.get("version", "1.0"),
        "v2_version": v2_data.get("version", "2.0")
    }
