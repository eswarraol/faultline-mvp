"""Full End-to-End Live Integration Test for Faultline."""

import sys
import time
import json
import asyncio
import subprocess
from pathlib import Path
import websockets
import urllib.request

BACKEND_DIR = Path(__file__).parent.resolve()
DEMO_REPO_DIR = BACKEND_DIR / "demo_repo"

async def test_live_system():
    print("=== FAULTLINE LIVE SYSTEM E2E VERIFICATION ===")
    
    # 1. Test Server Health
    print("\n[Step 1] Checking REST API Health...")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/state")
    state = json.loads(req.read().decode())
    print(f"  [OK] REST API live: status='{state.get('status')}'")

    # 2. Reset Repo
    print("\n[Step 2] Resetting Repository to Pristine State...")
    req = urllib.request.Request("http://127.0.0.1:8000/api/reset", data=b"", method="POST")
    res = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"  [OK] Repo reset: {res}")

    # 3. Simulate API Change
    print("\n[Step 3] Simulating API v1 -> v2 Breaking Change...")
    req = urllib.request.Request("http://127.0.0.1:8000/api/simulate", data=b"", method="POST")
    sim_data = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"  [OK] Breaking change detected: '{sim_data.get('breaking_change')}'")

    # 4. Connect WebSocket Telemetry Stream
    print("\n[Step 4] Connecting WebSocket Telemetry Stream ws://127.0.0.1:8000/ws/agent...")
    received_logs = []
    
    async with websockets.connect("ws://127.0.0.1:8000/ws/agent") as ws:
        msg = await ws.recv()
        print(f"  [OK] WebSocket connected: {msg}")

        # 5. Trigger Agent Workflow while listening to WebSocket
        print("\n[Step 5] Triggering Autonomous AI Workflow (POST /api/run-agent)...")
        
        loop = asyncio.get_event_loop()
        def call_agent():
            req = urllib.request.Request("http://127.0.0.1:8000/api/run-agent", data=b"", method="POST")
            return json.loads(urllib.request.urlopen(req).read().decode())

        agent_future = loop.run_in_executor(None, call_agent)

        while not agent_future.done():
            try:
                log_raw = await asyncio.wait_for(ws.recv(), timeout=0.5)
                log_data = json.loads(log_raw)
                received_logs.append(log_data)
                print(f"   [Telemetry WS] {log_data.get('type')}: {log_data.get('content')[:90]}...")
            except asyncio.TimeoutError:
                pass

        agent_result = await agent_future
        print(f"\n  [OK] Agent Workflow Completed!")
        print(f"     - Discovered Files: {list(agent_result['discovery']['discovered_files'].keys())}")
        print(f"     - Impact Total Files: {agent_result['impact']['total_files']}")
        print(f"     - Pytest Verification: Passed {agent_result['verification']['passed_tests']}/{agent_result['verification']['total_tests']} tests")
        print(f"     - Telemetry Messages Received: {len(received_logs)}")

        # 6. Approve & Apply Patch
        print("\n[Step 6] Operator Approving & Applying Patch (POST /api/approve)...")
        req = urllib.request.Request("http://127.0.0.1:8000/api/approve", data=b"", method="POST")
        appr_res = json.loads(urllib.request.urlopen(req).read().decode())
        print(f"  [OK] Patch Applied: {appr_res}")

        # 7. Run real pytest on modified disk files
        print("\n[Step 7] Running real pytest directly against disk files in demo_repo...")
        pytest_cmd = [sys.executable, "-m", "pytest", "tests", "-v"]
        result = subprocess.run(pytest_cmd, cwd=DEMO_REPO_DIR, capture_output=True, text=True)
        print("--- Pytest Standard Output ---")
        print(result.stdout)
        assert result.returncode == 0, f"Pytest failed with exit code {result.returncode}"
        print("  [OK] REAL PYTEST SUITE PASSED ON DISK FILES!")

    print("\n=======================================================")
    print("  ALL 7 STAGES FULLY VERIFIED AND WORKING 100% LIVE!")
    print("=======================================================\n")

if __name__ == "__main__":
    asyncio.run(test_live_system())
