"""Tool wrapper for executing pytest verification."""

from verification.run_tests import run_tests_on_patch

def tool_run_tests(modified_files: dict) -> dict:
    """Wrapper function to execute real pytest verification."""
    return run_tests_on_patch(modified_files)
