from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class AIRiskLogAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_ai_risk_log(self):
        payload = {
            "user_address": "0x123",
            "recipient_address": "0x456",
            "risk_score": 5,
            "status": "Safe",
            "warning_message": "Pass"
        }
        response = self.client.post('/api/v1/ai-risk-logs/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_ai_risk_logs(self):
        response = self.client.get('/api/v1/ai-risk-logs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)