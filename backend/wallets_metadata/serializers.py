from rest_framework import serializers
from rest_framework import serializers
from .models import WalletMetadata

class WalletMetadataSerializer(serializers.ModelSerializer):
    class Meta:                          # ← এখানে "Type" না লিখে "Meta" লিখতে হবে
        model = WalletMetadata
        fields = ['id', 'address', 'wallet_type', 'created_at']
        read_only_fields = ['id', 'created_at']