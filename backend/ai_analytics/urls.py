from django.urls import path
from .views import AIRiskLogListCreateView

urlpatterns = [
    path('ai-risk-logs/', AIRiskLogListCreateView.as_view(), name='ai-risk-log-list-create'),
]