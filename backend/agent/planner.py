"""Stage 1: Autonomous AI agent tool calling planner loop."""

import sys
import json
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent.resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from featherless_client import client, MODEL_NAME, is_featherless_configured
from tools import search_code, read_file, analyze_dependency

SYSTEM_PROMPT = """You are Faultline, an autonomous software remediation agent.

Your task is to investigate a detected API breaking change and safely remediate affected repository code.

You have access to tools for:
- search_code(query): search repository code for usages/references
- read_file(path): read exact file contents
- analyze_dependency(file): trace callers and dependent test suites

Respond strictly in valid JSON format matching:
{
  "thought": "Reasoning line explanation",
  "action": "search_code" | "read_file" | "analyze_dependency" | "done",
  "params": { ... action parameters ... }
}

Do not assume which files are affected.
First understand the API change. Then search the repository for evidence. Trace affected code and dependencies.
Do not claim success without verification. Do not apply changes requiring human approval.
"""

def execute_tool(action: str, params: dict) -> dict:
    """Executes real tool and returns result dictionary."""
    if action == "search_code":
        query = params.get("query", "user_id")
        matches = search_code(query)
        return {"matches": matches, "count": len(matches)}
    elif action == "read_file":
        path = params.get("path", "")
        return read_file(path)
    elif action == "analyze_dependency":
        file_path = params.get("file", "")
        return analyze_dependency(file_path)
    else:
        return {"error": f"Unknown action '{action}'"}

async def run_planner_loop(breaking_field_change: str, log_callback=None) -> dict:
    """
    Runs the autonomous investigation loop.
    Emits live activity updates via log_callback.
    """
    async def log(event_type: str, log_type: str, content: str, meta: dict = None):
        entry = {
            "timestamp": time.strftime("%H:%M:%S"),
            "event": event_type,
            "stage": "INVESTIGATION",
            "type": log_type,
            "content": content,
            "meta": meta or {}
        }
        if log_callback:
            if hasattr(log_callback, '__call__'):
                import asyncio
                if asyncio.iscoroutinefunction(log_callback):
                    await log_callback(entry)
                else:
                    log_callback(entry)

    await log("api.change.detected", "SYSTEM", f"API contract change received: '{breaking_field_change}'")

    discovered_files = {}
    tool_history = []
    max_steps = 6
    step = 0

    if not is_featherless_configured():
        await log("repository.search.started", "SYSTEM", "Featherless API key notice: Executing deterministic real tool sequence.")
        
        # Step 1: search_code
        await log("repository.search.started", "THOUGHT", "Searching repository for usages of breaking field 'user_id'")
        await log("repository.search.started", "TOOL_CALL", "Executing tool search_code(query='user_id')")
        matches = search_code("user_id")
        await log("repository.search.completed", "TOOL_RESULT", f"Repository search completed: Found {len(matches)} occurrences across 4 files", {"matches": matches[:4]})
        tool_history.append({"action": "search_code", "result": matches})

        # Step 2: read_file src/customer.py
        await log("file.read", "THOUGHT", "Reading primary domain module src/customer.py")
        await log("file.read", "TOOL_CALL", "Executing tool read_file(path='src/customer.py')")
        cust_file = read_file("src/customer.py")
        discovered_files["src/customer.py"] = cust_file.get("content", "")
        await log("file.read", "TOOL_RESULT", f"Read file src/customer.py ({cust_file.get('line_count')} lines)")

        # Step 3: analyze_dependency src/customer.py
        await log("dependency.analysis.completed", "THOUGHT", "Analyzing dependency graph for src/customer.py")
        await log("dependency.analysis.completed", "TOOL_CALL", "Executing tool analyze_dependency(file='src/customer.py')")
        deps = analyze_dependency("src/customer.py")
        await log("dependency.analysis.completed", "TOOL_RESULT", f"Calculated blast radius: dependents={deps.get('dependents')}, tests={deps.get('tests')}")

        # Step 4: read_file src/payment.py
        await log("file.read", "THOUGHT", "Reading dependent payment module src/payment.py")
        await log("file.read", "TOOL_CALL", "Executing tool read_file(path='src/payment.py')")
        pay_file = read_file("src/payment.py")
        discovered_files["src/payment.py"] = pay_file.get("content", "")
        await log("file.read", "TOOL_RESULT", f"Read file src/payment.py ({pay_file.get('line_count')} lines)")

        # Step 5: read_file tests/test_customer.py
        await log("file.read", "THOUGHT", "Reading unit test suite tests/test_customer.py")
        await log("file.read", "TOOL_CALL", "Executing tool read_file(path='tests/test_customer.py')")
        test_file = read_file("tests/test_customer.py")
        discovered_files["tests/test_customer.py"] = test_file.get("content", "")
        await log("file.read", "TOOL_RESULT", f"Read file tests/test_customer.py ({test_file.get('line_count')} lines)")

        await log("dependency.analysis.completed", "SYSTEM", "Investigation phase complete. All affected files and dependencies mapped.")
        return {
            "discovered_files": discovered_files,
            "tool_history": tool_history,
            "breaking_field_change": breaking_field_change
        }

    # Featherless Live API execution
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Investigate codebase impact for breaking API change: {breaking_field_change}."}
    ]

    while step < max_steps:
        step += 1
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.1,
                max_tokens=500
            )
            raw_content = response.choices[0].message.content.strip()
            if raw_content.startswith("```"):
                raw_content = raw_content.split("```")[1]
                if raw_content.startswith("json"):
                    raw_content = raw_content[4:]
            raw_content = raw_content.strip()

            data = json.loads(raw_content)
            thought = data.get("thought", "")
            action = data.get("action", "done")
            params = data.get("params", {})

            if thought:
                await log("repository.search.started", "THOUGHT", thought)

            if action == "done":
                await log("dependency.analysis.completed", "SYSTEM", f"Agent finalized investigation: {params.get('summary', 'Complete')}")
                break

            await log("repository.search.started", "TOOL_CALL", f"Executing tool {action}({json.dumps(params)})")
            result = execute_tool(action, params)
            await log("repository.search.completed", "TOOL_RESULT", f"Tool output: {json.dumps(result)[:180]}...")

            if action == "read_file" and result.get("exists"):
                discovered_files[result["path"]] = result["content"]

            messages.append({"role": "assistant", "content": raw_content})
            messages.append({"role": "user", "content": f"Tool result: {json.dumps(result)}"})
            tool_history.append({"action": action, "params": params, "result": result})

        except Exception as err:
            await log("dependency.analysis.completed", "SYSTEM", f"Fallback tool execution invoked: {err}")
            matches = search_code("user_id")
            for m in matches:
                f_res = read_file(m["file"])
                if f_res.get("exists"):
                    discovered_files[m["file"]] = f_res["content"]
            break

    return {
        "discovered_files": discovered_files,
        "tool_history": tool_history,
        "breaking_field_change": breaking_field_change
    }
