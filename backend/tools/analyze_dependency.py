"""Dependency analysis tool to trace usages across src/ and tests/."""

from pathlib import Path

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

def analyze_dependency(file_path: str) -> dict:
    """
    Analyzes references and dependencies for a given python file in demo_repo.
    Extracts module name, defined classes/functions, and finds files importing/calling it.
    """
    rel_path = file_path.replace("\\", "/")
    file_name = Path(rel_path).stem
    
    dependents = []
    tests_affected = []
    
    target_py = DEMO_REPO_DIR / rel_path
    if not target_py.exists():
        return {"file": rel_path, "dependents": [], "tests": [], "error": "File not found"}

    for subfolder in ["src", "tests"]:
        folder = DEMO_REPO_DIR / subfolder
        if not folder.exists():
            continue
        for p in folder.rglob("*.py"):
            if p.resolve() == target_py.resolve():
                continue
            text = p.read_text(encoding="utf-8")
            p_rel = p.relative_to(DEMO_REPO_DIR).as_posix()
            
            if file_name in text or f"src.{file_name}" in text or f"import {file_name}" in text:
                if p_rel.startswith("tests/"):
                    tests_affected.append(p_rel)
                else:
                    dependents.append(p_rel)

    return {
        "file": rel_path,
        "dependents": list(set(dependents)),
        "tests": list(set(tests_affected))
    }

if __name__ == "__main__":
    res = analyze_dependency("src/customer.py")
    print(f"Dependency analysis for src/customer.py: {res}")
