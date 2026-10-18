from rest_framework import generics
from .models import WalletMetadata
from .serializers import WalletMetadataSerializer

class WalletListCreateView(generics.ListCreateAPIView):
    queryset = WalletMetadata.objects.all().order_by('-created_at')
    serializer_class = WalletMetadataSerializer