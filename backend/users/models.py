from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_subscribed = models.BooleanField(default=False)
    subscription_plan = models.CharField(max_length=50, default='Free')

    USERNAME_FIELD = 'email'          # লগইন হবে email দিয়ে
    REQUIRED_FIELDS = ['username']    # createsuperuser-এ username চাইবে

    def __str__(self):
        return self.email