from django.db import models

class WalletMetadata(models.Model):
    address = models.CharField(max_length=255, unique=True)
    wallet_type = models.CharField(max_length=50, default='evm')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wallet_type.upper()} - {self.address}"