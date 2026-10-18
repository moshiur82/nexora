from django.db import models


class AIRiskLog(models.Model):
    user_address = models.CharField(max_length=255)
    recipient_address = models.CharField(max_length=255)
    risk_score = models.IntegerField(default=0)
    status = models.CharField(max_length=50)  # Safe / Suspicious / High Risk
    warning_message = models.TextField(blank=True)
    checked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-checked_at']

    def __str__(self):
        return f"{self.status} ({self.risk_score}) - {self.recipient_address[:12]}..."