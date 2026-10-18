from django.urls import path
from .views import UserSubscriptionView

urlpatterns = [
    path('subscription/', UserSubscriptionView.as_view(), name='user-subscription'),
]