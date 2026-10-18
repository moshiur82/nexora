from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/v1/', include('wallets_metadata.urls')),
    path('api/v1/', include('ai_analytics.urls')),  # ← এটা লাগবে
    path('api/v1/', include('subscriptions.urls')),
]