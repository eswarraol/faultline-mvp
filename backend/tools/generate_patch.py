"""Tool wrapper for patch generation stage."""

from agent.patch import generate_patch

def tool_generate_patch(discovery_data: dict) -> dict:
    """Wrapper function to execute patch generation."""
    return generate_patch(discovery_data)
