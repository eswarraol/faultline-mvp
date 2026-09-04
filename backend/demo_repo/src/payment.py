"""Payment domain helper relying on customer identification."""

from src.customer import CustomerService

class PaymentProcessor:
    def __init__(self, customer_service: CustomerService):
        self.customer_service = customer_service

    def process_billing(self, payload: dict, amount: float) -> dict:
        """Processes billing for a given customer payload."""
        parsed = self.customer_service.parse_customer_payload(payload)
        account_id = parsed["customer_id"]
        
        if amount <= 0:
            raise ValueError("Amount must be positive")

        return {
            "transaction_id": f"tx_{account_id}_9982",
            "account_id": account_id,
            "amount": amount,
            "status": "completed"
        }
