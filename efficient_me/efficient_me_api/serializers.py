from .models import ActivityType, Activity, Goal, TimeAllocation
from rest_framework import serializers
from django.contrib.auth.models import User


class ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = ['id', 'title', 'description', 'created']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'created', 'title', 'description', 'activity_type']


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'created', 'title', 'description',
                  'hours_required', 'priority', 'deadline', 'activity']


class TimeAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeAllocation
        fields = ['id', 'created', 'title', 'description',
                  'date_completed', 'time_speant', 'description', 'goal']


class UserSerializer(serializers.ModelSerializer):
    # actitivies = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Activity.objects.all())

    def create(self, validated_data):
        instance = User.objects.create_user(**validated_data)
        return instance

    class Meta:
        model = User
        fields = ['id', 'username', 'password',
                  'first_name', 'last_name']


class NestedGoalSerializer(serializers.ModelSerializer):
    timeallocation_set = TimeAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'created', 'title', 'description',
                  'hours_required', 'priority', 'deadline', 'activity', 'timeallocation_set']


class NestedActivitySerializer(serializers.ModelSerializer):
    goal_set = NestedGoalSerializer(many=True, read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'created', 'title',
                  'description', 'activity_type', 'goal_set']
