"""Unit tests for CustomerService and PaymentProcessor under API v2."""

import pytest
from src.customer import CustomerService
from src.payment import PaymentProcessor

def test_parse_customer_payload_success():
    service = CustomerService("api/v2.json")
    payload = {"account_id": "cust_101", "email": "alice@example.com", "status": "active"}
    res = service.parse_customer_payload(payload)
    assert res["customer_id"] == "cust_101"
    assert res["email"] == "alice@example.com"

def test_format_customer_response():
    service = CustomerService("api/v2.json")
    res = service.format_customer_response({"customer_id": "cust_102", "email": "BOB@EXAMPLE.COM", "status": "active"})
    assert res["account_id"] == "cust_102"
    assert res["is_active"] is True

def test_payment_processor_success():
    service = CustomerService("api/v2.json")
    processor = PaymentProcessor(service)
    payload = {"account_id": "cust_103", "email": "carol@example.com"}
    res = processor.process_billing(payload, 49.99)
    assert res["status"] == "completed"
    assert res["account_id"] == "cust_103"

def test_parse_customer_payload_missing_field():
    service = CustomerService("api/v2.json")
    payload = {"invalid_key": "123"}
    with pytest.raises(KeyError):
        service.parse_customer_payload(payload)
