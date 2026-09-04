"""Utility script to maintain pristine copy and reset demo_repo."""

import os
import shutil
from pathlib import Path

DEMO_REPO_DIR = Path(__file__).parent.resolve()
PRISTINE_DIR = DEMO_REPO_DIR / "_pristine"

FOLDERS_TO_SYNC = ["src", "tests", "api"]

def setup_pristine():
    """Initializes _pristine directory from current src, tests, api."""
    if not PRISTINE_DIR.exists():
        PRISTINE_DIR.mkdir(parents=True, exist_ok=True)
    
    for folder in FOLDERS_TO_SYNC:
        src_path = DEMO_REPO_DIR / folder
        dst_path = PRISTINE_DIR / folder
        if src_path.exists():
            if dst_path.exists():
                shutil.rmtree(dst_path)
            shutil.copytree(src_path, dst_path)

def reset_demo_repo():
    """Restores src, tests, api in demo_repo from _pristine."""
    if not PRISTINE_DIR.exists():
        setup_pristine()
        return

    for folder in FOLDERS_TO_SYNC:
        src_path = PRISTINE_DIR / folder
        dst_path = DEMO_REPO_DIR / folder
        if src_path.exists():
            if dst_path.exists():
                shutil.rmtree(dst_path)
            shutil.copytree(src_path, dst_path)

if __name__ == "__main__":
    setup_pristine()
    print("Pristine copy initialized successfully.")
