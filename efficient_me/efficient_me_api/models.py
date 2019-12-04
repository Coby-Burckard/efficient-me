from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class ActivityType(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=50, null=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        'auth.User', related_name='activity_type', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Activity(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True)
    activity_type = models.ManyToManyField(ActivityType)
    user = models.ForeignKey(
        'auth.User', related_name='activity', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created']


class Goal(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True)
    hours_required = models.IntegerField(null=True)
    priority = models.IntegerField(null=True, default=0)
    deadline = models.DateField()
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    user = models.ForeignKey(
        'auth.User', related_name='goal', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-deadline']


class TimeAllocation(models.Model):
    title = models.CharField(max_length=50)
    created = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateField()
    time_speant = models.FloatField(max_length=5)
    description = models.CharField(max_length=100, null=True)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE)
    user = models.ForeignKey(
        'auth.User', related_name='time_allocation', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created']


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
