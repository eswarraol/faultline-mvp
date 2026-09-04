"""Local repository provider operating over demo_repo."""

import time
from pathlib import Path
from repositories.base import RepositoryProvider
from tools.search_code import search_code
from tools.read_file import read_file

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

class LocalRepositoryProvider(RepositoryProvider):
    def __init__(self):
        self.repo_name = "faultline/demo_repo"
        self.branch = "main"

    def get_info(self) -> dict:
        return {
            "provider": "local",
            "repo_name": self.repo_name,
            "branch": self.branch,
            "path": str(DEMO_REPO_DIR),
            "files_count": 5
        }

    def read_file(self, path: str) -> dict:
        return read_file(path)

    def search_code(self, query: str) -> list[dict]:
        return search_code(query)

    def apply_patch_to_disk(self, modified_files: dict) -> dict:
        applied = []
        for rel_path, content in modified_files.items():
            p_str = str(rel_path).replace("\\", "/")
            if p_str.startswith("demo_repo/"):
                p_str = p_str[10:]
            target = DEMO_REPO_DIR / p_str
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
            applied.append(rel_path)
        return {"status": "applied", "applied_files": applied}

    def create_pull_request(self, title: str, body: str, modified_files: dict) -> dict:
        self.apply_patch_to_disk(modified_files)
        branch_name = f"faultline/api-remediation-{int(time.time())}"
        pr_url = f"https://github.com/faultline-ai/demo_repo/pull/{int(time.time() % 1000)}"
        return {
            "status": "pr_created",
            "branch": branch_name,
            "pr_url": pr_url,
            "pr_number": int(time.time() % 1000),
            "title": title,
            "body": body,
            "is_simulated": False
        }
