"""RepositoryProvider base interface."""

from abc import ABC, abstractmethod

class RepositoryProvider(ABC):
    @abstractmethod
    def get_info(self) -> dict:
        pass

    @abstractmethod
    def read_file(self, path: str) -> dict:
        pass

    @abstractmethod
    def search_code(self, query: str) -> list[dict]:
        pass

    @abstractmethod
    def apply_patch_to_disk(self, modified_files: dict) -> dict:
        pass

    @abstractmethod
    def create_pull_request(self, title: str, body: str, modified_files: dict) -> dict:
        pass
