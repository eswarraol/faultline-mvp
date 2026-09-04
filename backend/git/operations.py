"""Git operations helper for checkpointing and state rollback."""

import shutil
from pathlib import Path
from demo_repo.reset import reset_demo_repo, PRISTINE_DIR, DEMO_REPO_DIR

checkpoint_cache = {}

def create_git_checkpoint(checkpoint_id: str = "pre_remediation") -> dict:
    """Creates a local file state checkpoint before patch application."""
    checkpoint_dir = DEMO_REPO_DIR.parent / f"_checkpoint_{checkpoint_id}"
    if checkpoint_dir.exists():
        shutil.rmtree(checkpoint_dir)
    
    shutil.copytree(DEMO_REPO_DIR, checkpoint_dir, ignore=shutil.ignore_patterns("_pristine", "__pycache__"))
    checkpoint_cache[checkpoint_id] = str(checkpoint_dir)
    
    return {
        "status": "checkpoint_created",
        "checkpoint_id": checkpoint_id,
        "checkpoint_path": str(checkpoint_dir)
    }

def rollback_git_checkpoint(checkpoint_id: str = "pre_remediation") -> dict:
    """Restores repository state to checkpoint or pristine backup."""
    checkpoint_dir = checkpoint_cache.get(checkpoint_id)
    if checkpoint_dir and Path(checkpoint_dir).exists():
        for subfolder in ["src", "tests", "api"]:
            src_path = Path(checkpoint_dir) / subfolder
            dst_path = DEMO_REPO_DIR / subfolder
            if src_path.exists():
                if dst_path.exists():
                    shutil.rmtree(dst_path)
                shutil.copytree(src_path, dst_path)
        return {"status": "rolled_back", "checkpoint_id": checkpoint_id}

    # Fallback to pristine reset
    reset_demo_repo()
    return {"status": "rolled_back", "checkpoint_id": "pristine_fallback"}
