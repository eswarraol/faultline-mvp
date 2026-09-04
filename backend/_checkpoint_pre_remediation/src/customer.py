"""Customer domain logic consuming API schema."""

import json

class CustomerService:
    def __init__(self, api_config_path="api/v2.json"):
        with open(api_config_path, "r") as f:
            self.schema = json.load(f)

    def parse_customer_payload(self, payload: dict) -> dict:
        """Parses customer payload validating account_id field (with user_id fallback)."""
        # Supports API v2 'account_id' with backwards-compatible 'user_id' fallback
        account_key = "account_id" if "account_id" in payload else "user_id"
        if account_key not in payload:
            raise KeyError("Missing required field 'account_id' or 'user_id' in customer payload")
        
        return {
            "customer_id": payload[account_key],
            "email": payload.get("email", ""),
            "status": payload.get("status", "active")
        }

    def format_customer_response(self, customer_data: dict) -> dict:
        """Formats response using account_id field."""
        return {
            "account_id": customer_data["customer_id"],
            "formatted_email": customer_data["email"].lower(),
            "is_active": customer_data["status"] == "active"
        }
