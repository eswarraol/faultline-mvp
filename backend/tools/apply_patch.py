"""Tool wrapper for applying patch directly to demo repository."""

from pathlib import Path

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

def apply_patch(modified_files: dict) -> dict:
    """Applies modified files dictionary to demo_repo."""
    applied = []
    for rel_path, content in modified_files.items():
        target = DEMO_REPO_DIR / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        applied.append(rel_path)
    return {"status": "applied", "applied_files": applied}
