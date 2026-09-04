"""End-to-End API endpoint test suite."""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).parent.resolve()
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from main import app

client = TestClient(app)

def test_full_workflow():
    print("1. Testing POST /api/reset ...")
    res_reset = client.post("/api/reset")
    assert res_reset.status_code == 200
    assert res_reset.json()["status"] == "reset"
    print("   Reset OK.")

    print("2. Testing POST /api/simulate ...")
    res_sim = client.post("/api/simulate")
    assert res_sim.status_code == 200
    sim_data = res_sim.json()
    breaking_desc = sim_data.get("contract_diff", {}).get("breaking_change", "renamed field")
    print(f"   Simulate OK: {breaking_desc}")

    print("3. Testing POST /api/run-agent ...")
    res_agent = client.post("/api/run-agent")
    assert res_agent.status_code == 200
    agent_data = res_agent.json()
    assert agent_data["status"] == "pending_approval"
    assert agent_data["verification"]["passed"] is True
    print(f"   Agent workflow OK: passed={agent_data['verification']['passed_tests']}/{agent_data['verification']['total_tests']}")

    print("4. Testing POST /api/approve ...")
    res_appr = client.post("/api/approve")
    assert res_appr.status_code == 200
    assert res_appr.json()["status"] == "approved"
    print("   Approve & Apply OK.")

    print("\nALL END-TO-END BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_workflow()
