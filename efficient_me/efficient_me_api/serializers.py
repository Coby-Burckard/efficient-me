from .models import ActivityType, Activity, Goal, TimeAllocation
from rest_framework import serializers

def ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = ['title', 'description', 'created', 'user']

def ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['created', 'title', 'description', 'activity_type']

def GoalSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Goal
        fields = ['created', 'title', 'description', 'hours_required', 'priority', 'deadline', 'activity']
    
def TimeAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeAllocation
        fields = ['created', 'title', 'description', 'date_completed', 'time_speant', 'description', 'goal']

