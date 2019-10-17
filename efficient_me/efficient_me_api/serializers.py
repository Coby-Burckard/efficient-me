from .models import ActivityType, Activity, Goal, TimeAllocation
from rest_framework import serializers
from django.contrib.auth.models import User

class ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = ['title', 'description', 'created']

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['created', 'title', 'description', 'activity_type']

class GoalSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Goal
        fields = ['created', 'title', 'description', 'hours_required', 'priority', 'deadline', 'activity']
    
class TimeAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeAllocation
        fields = ['created', 'title', 'description', 'date_completed', 'time_speant', 'description', 'goal']

class UserSerializer(serializers.ModelSerializer):
    actitivies = serializers.PrimaryKeyRelatedField(many=True, queryset=Activity.objects.all())

    class Meta:
        model = User
        fields = ['id, username, activities']