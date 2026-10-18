from rest_framework import serializers
from .models import AIRiskLog


class AIRiskLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRiskLog
        fields = [
            'id',
            'user_address',
            'recipient_address',
            'risk_score',
            'status',
            'warning_message',
            'checked_at',
        ]
        read_only_fields = ['id', 'checked_at']