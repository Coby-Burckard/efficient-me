from .models import Activity, Goal, TimeAllocation, ActivityType
from django.contrib.auth.models import User
from .serializers import ActivitySerializer, GoalSerializer, TimeAllocationSerializer, ActivityTypeSerializer, UserSerializer
from rest_framework import generics, permissions
from .permissions import IsOwnerOrBackOff
from rest_framework.authentication import TokenAuthentication


'''
Notes:
    Javascript fetch for testing in the frontend
        const response = await fetch('http://127.0.0.1:8000/activities/', {headers:{'Authorization': 'Basic ' + btoa('admin:admin')}});
        const myJson = await response.json();
        console.log(JSON.stringify(myJson));
'''


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
