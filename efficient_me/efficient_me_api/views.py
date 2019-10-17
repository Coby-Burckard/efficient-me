from .models import Activity
from .serializers import ActivitySerializer
from rest_framework import generics, permissions
from .permissions import IsOwnerOrBackOff

class rud_activity(generics.RetrieveUpdateDestroyAPIView):
    '''
    get or delete an activity
    '''

    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

class c_activity(generics.CreateAPIView):
    '''
    create a new activity
    '''
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrBackOff]

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)