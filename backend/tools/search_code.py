"""Real code search tool with strict path traversal prevention."""

import os
from pathlib import Path

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

def search_code(query: str) -> list[dict]:
    """
    Searches for query string across all .py and .json files in demo_repo.
    Validates directories to ensure zero traversal outside demo_repo.
    """
    results = []
    if not query or not isinstance(query, str):
        return results

    demo_base = os.path.abspath(str(DEMO_REPO_DIR))
    query_lower = query.lower()
    
    for subfolder in ["src", "tests", "api"]:
        folder_path = os.path.abspath(os.path.join(demo_base, subfolder))
        if not folder_path.startswith(demo_base) or not os.path.exists(folder_path):
            continue
            
        for root, _, files in os.walk(folder_path):
            abs_root = os.path.abspath(root)
            if not abs_root.startswith(demo_base):
                continue
                
            for file_name in files:
                if file_name.endswith(".py") or file_name.endswith(".json"):
                    file_path = os.path.join(abs_root, file_name)
                    if not file_path.startswith(demo_base):
                        continue
                        
                    rel_path = os.path.relpath(file_path, demo_base).replace("\\", "/")
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            lines = f.read().splitlines()
                        for line_no, line_content in enumerate(lines, 1):
                            if query_lower in line_content.lower():
                                results.append({
                                    "file": rel_path,
                                    "line": line_no,
                                    "snippet": line_content.strip()
                                })
                    except Exception:
                        pass

    return results

if __name__ == "__main__":
    res = search_code("user_id")
    print(f"Search results count: {len(res)}")
