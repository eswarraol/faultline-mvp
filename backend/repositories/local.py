"""Local repository provider operating over demo_repo with branch, merge, & state-aware rollback support."""

import time
from pathlib import Path
from repositories.base import RepositoryProvider
from tools.search_code import search_code
from tools.read_file import read_file

DEMO_REPO_DIR = Path(__file__).parent.parent / "demo_repo"

class LocalRepositoryProvider(RepositoryProvider):
    def __init__(self):
        self.repo_name = "payment-service"
        self.branch = "main"

    def get_info(self) -> dict:
        return {
            "provider": "local",
            "repo_name": self.repo_name,
            "repository": self.repo_name,
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
        ts = int(time.time())
        branch_name = f"faultline/remediate-api-change-{ts % 10000}"
        commit_sha = f"{ts % 0xffffff:07x}"
        pr_num = ts % 1000
        pr_url = f"https://github.com/faultline-ai/payment-service/pull/{pr_num}"
        return {
            "status": "pr_created",
            "provider": "local",
            "repository": self.repo_name,
            "target_branch": self.branch,
            "remediation_branch": branch_name,
            "commit_sha": commit_sha,
            "pr_url": pr_url,
            "pr_number": pr_num,
            "title": title,
            "body": body,
            "is_simulated": True
        }

    def merge_pull_request(self, pr_number: int = None, branch_name: str = None) -> dict:
        ts = int(time.time())
        merge_sha = f"mrg_{ts % 0xffffff:06x}"
        return {
            "status": "merged",
            "merged_into": self.branch,
            "sha": merge_sha,
            "message": f"Successfully merged into {self.branch}",
            "is_simulated": True
        }

    def rollback_remediation(self, pr_number: int = None, branch_name: str = None, is_merged: bool = False) -> dict:
        ts = int(time.time())
        from git.operations import rollback_git_checkpoint
        rollback_git_checkpoint("pre_remediation")

        if not is_merged:
            return {
                "status": "discarded",
                "ui_status_text": "Remediation discarded",
                "message": "Remediation discarded. Target branch main unchanged.",
                "target_branch_status": "unchanged",
                "is_merged": False
            }
        else:
            revert_sha = f"rvt_{ts % 0xffffff:06x}"
            return {
                "status": "reverted",
                "ui_status_text": "Revert created",
                "message": f"Remediation reverted. Revert commit '{revert_sha}' created on main.",
                "revert_sha": revert_sha,
                "target_branch_status": "reverted",
                "is_merged": True
            }
