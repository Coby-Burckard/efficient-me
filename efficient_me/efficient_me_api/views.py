from .models import Activity, Goal, TimeAllocation, ActivityType
from django.contrib.auth.models import User
from .serializers import ActivitySerializer, GoalSerializer, TimeAllocationSerializer, ActivityTypeSerializer, UserSerializer, NestedGoalSerializer, NestedActivitySerializer
from rest_framework import generics, permissions
from .permissions import IsOwnerOrBackOff
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response


class RUDActivityType(generics.RetrieveUpdateDestroyAPIView):
    '''
    get or delete an activity
    '''
    queryset = ActivityType.objects.all()
    serializer_class = ActivityTypeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]


class LCActivityType(generics.ListCreateAPIView):
    '''
    create a new activity
    '''

    serializer_class = ActivityTypeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        print(self.request.GET)
        user = self.request.user
        return ActivityType.objects.filter(user=user)


class RUDActivity(generics.RetrieveUpdateDestroyAPIView):
    '''
    get or delete an activity
    '''

    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]


class LCActivity(generics.ListCreateAPIView):
    '''
    create a new activity
    '''
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Activity.objects.filter(user=user)


class RUDGoal(generics.RetrieveUpdateDestroyAPIView):
    '''
    retrieve a list of goals for a user, update a goal, or delete a goal
    '''

    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]


class LCGoal(generics.ListCreateAPIView):
    '''
    create a new activity
    '''
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Goal.objects.filter(user=user)


class RUDTimeAllocation(generics.RetrieveUpdateDestroyAPIView):
    '''
    retrieve a list of goals for a user, update a goal, or delete a goal
    '''

    queryset = TimeAllocation.objects.all()
    serializer_class = TimeAllocationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]


class LCTimeAllocation(generics.ListCreateAPIView):
    '''
    create a new activity
    '''
    serializer_class = TimeAllocationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return TimeAllocation.objects.filter(user=user)


class CUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class fullUserPage(APIView):
    """
        Responds with the owner's full user page if they are authenticated
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def get(self, format=None):
        activities = Activity.objects.all()
        serializer = NestedActivitySerializer(
            activities, many=True, read_only=True)
        return Response(serializer.data)
