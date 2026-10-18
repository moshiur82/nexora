from rest_framework import generics, permissions
from .models import UserSubscription
from .serializers import UserSubscriptionSerializer
from datetime import datetime, timedelta

class UserSubscriptionView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # ইউজারের নিজস্ব সাবস্ক্রিপশন রিটার্ন করবে, না থাকলে ফ্রি প্ল্যান তৈরি করে নেবে
        subscription, created = UserSubscription.objects.get_or_create(
            user=self.request.user,
            defaults={
                'plan_name': 'Free',
                'is_active': True,
                'expires_at': datetime.now() + timedelta(days=365)
            }
        )
        return subscription

    def perform_update(self, serializer):
        serializer.save(user=self.request.user, is_active=True)