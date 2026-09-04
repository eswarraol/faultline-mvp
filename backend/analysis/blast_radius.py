"""Blast radius surface calculator and source code evidence extractor."""

from pathlib import Path
from tools.search_code import search_code
from tools.read_file import read_file
from tools.analyze_dependency import analyze_dependency

def compute_blast_radius(old_field: str, new_field: str) -> dict:
    """
    Scans repository using real tools to extract exact line matches and dependency relationships.
    Returns impact tree structure, total files, total functions, test suites, and line evidence.
    """
    matches = search_code(old_field)
    
    files_affected = set()
    functions_affected = set()
    tests_affected = set()
    evidence_items = []

    for match in matches:
        file_path = match["file"]
        files_affected.add(file_path)
        
        # Line evidence object
        evidence_items.append({
            "file": file_path,
            "line": match["line"],
            "snippet": match["snippet"],
            "target": old_field
        })

        if file_path.startswith("tests/"):
            tests_affected.add(file_path)

    # Analyze dependencies for discovered files
    for f in list(files_affected):
        if not f.startswith("tests/"):
            dep_res = analyze_dependency(f)
            for d in dep_res.get("dependents", []):
                files_affected.add(d)
            for t in dep_res.get("tests", []):
                tests_affected.add(t)

    # Function discovery heuristic
    for f in files_affected:
        res = read_file(f)
        if res.get("exists"):
            content = res.get("content", "")
            for line in content.splitlines():
                line_str = line.strip()
                if line_str.startswith("def ") and "(" in line_str:
                    fn_name = line_str.split("def ")[1].split("(")[0].strip()
                    functions_affected.add(fn_name)

    return {
        "old_contract": f"customer.{old_field}",
        "new_contract": f"customer.{new_field}",
        "total_files": len(files_affected),
        "total_functions": len(functions_affected),
        "total_test_suites": len(tests_affected),
        "affected_files": sorted(list(files_affected)),
        "affected_functions": sorted(list(functions_affected)),
        "affected_tests": sorted(list(tests_affected)),
        "evidence": evidence_items,
        "severity": "HIGH" if len(files_affected) > 1 else "MEDIUM"
    }
