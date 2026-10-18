from rest_framework import generics
from .models import AIRiskLog
from .serializers import AIRiskLogSerializer


class AIRiskLogListCreateView(generics.ListCreateAPIView):
    queryset = AIRiskLog.objects.all().order_by('-checked_at')
    serializer_class = AIRiskLogSerializer