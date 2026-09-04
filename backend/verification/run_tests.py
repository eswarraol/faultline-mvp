"""Verification engine running real pytest test suites against patched code."""

import sys
import shutil
import tempfile
import subprocess
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent.resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

DEMO_REPO_DIR = BACKEND_DIR / "demo_repo"

def run_tests_on_patch(modified_files: dict) -> dict:
    """
    Creates a temporary workspace, copies demo_repo files, applies modified_files patch,
    executes real pytest suite, and parses test results.
    """
    temp_dir = Path(tempfile.mkdtemp(prefix="faultline_test_runner_"))
    
    try:
        # Copy demo_repo structure to temp_dir
        for subfolder in ["src", "tests", "api"]:
            src_path = DEMO_REPO_DIR / subfolder
            if src_path.exists():
                shutil.copytree(src_path, temp_dir / subfolder)

        # Apply modified files patch
        for rel_path, content in modified_files.items():
            target_path = temp_dir / rel_path
            target_path.parent.mkdir(parents=True, exist_ok=True)
            target_path.write_text(content, encoding="utf-8")

        # Execute real pytest command using current python executable
        cmd = [sys.executable, "-m", "pytest", "tests", "-v", "--tb=short"]
        result = subprocess.run(
            cmd,
            cwd=temp_dir,
            capture_output=True,
            text=True,
            timeout=15
        )

        passed = (result.returncode == 0)
        output = result.stdout + "\n" + result.stderr

        # Parse test metrics from stdout
        total_tests = 4
        passed_count = 4 if passed else 0
        failed_count = 0 if passed else 4

        if "passed in" in output or "failed in" in output:
            import re
            p_match = re.search(r"(\d+) passed", output)
            f_match = re.search(r"(\d+) failed", output)
            if p_match:
                passed_count = int(p_match.group(1))
            if f_match:
                failed_count = int(f_match.group(1))
            total_tests = passed_count + failed_count

        return {
            "passed": passed,
            "exit_code": result.returncode,
            "output": output.strip(),
            "total_tests": total_tests,
            "passed_tests": passed_count,
            "failed_tests": failed_count,
            "runner_dir": str(temp_dir)
        }

    except Exception as e:
        return {
            "passed": False,
            "exit_code": -1,
            "output": f"Execution error running pytest: {str(e)}",
            "total_tests": 4,
            "passed_tests": 0,
            "failed_tests": 4,
            "error": str(e)
        }
    finally:
        # Cleanup temporary directory safely after execution
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass

if __name__ == "__main__":
    from agent.patch import generate_patch
    patch_res = generate_patch({"discovered_files": {}})
    test_res = run_tests_on_patch(patch_res["modified_files"])
    print(f"Test Run Result: passed={test_res['passed']}, total={test_res['total_tests']}, passed_count={test_res['passed_tests']}")
