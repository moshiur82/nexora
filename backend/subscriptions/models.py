from django.db import models
from django.conf import settings

class UserSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=50, default='Pro Analytics')
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.email} - {self.plan_name}"