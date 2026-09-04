"""Real file read tool with strict path traversal prevention."""

import os
from pathlib import Path

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

def read_file(file_path: str) -> dict:
    """
    Reads file content from demo_repo.
    Validates path with os.path.abspath and startswith to prevent directory traversal outside demo_repo.
    """
    if not file_path or not isinstance(file_path, str):
        return {"error": "Invalid file path input", "exists": False}

    demo_base = os.path.abspath(str(DEMO_REPO_DIR))

    if os.path.isabs(file_path):
        target_path = os.path.abspath(file_path)
    else:
        target_path = os.path.abspath(os.path.join(demo_base, file_path))

    # Path Traversal Check: Ensure target_path starts with demo_base
    if not target_path.startswith(demo_base):
        return {"error": "Access denied: Path traversal outside demo_repo is prohibited.", "exists": False}

    if not os.path.exists(target_path) or not os.path.isfile(target_path):
        return {"error": f"File '{file_path}' not found in demo_repo", "exists": False}

    try:
        with open(target_path, "r", encoding="utf-8") as f:
            content = f.read()
        lines = content.splitlines()
        rel_path = os.path.relpath(target_path, demo_base).replace("\\", "/")
        return {
            "path": rel_path,
            "content": content,
            "line_count": len(lines),
            "exists": True
        }
    except Exception as e:
        return {"error": f"Error reading file: {str(e)}", "exists": False}

if __name__ == "__main__":
    print(read_file("src/customer.py").get("exists"))
    print(read_file("../../.env").get("error"))
