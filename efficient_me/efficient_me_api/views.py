from .models import Activity
from .serializers import ActivitySerializer
from rest_framework import generics

class get_delete_activity(generics.RetrieveDestroyAPIView):
    '''
    get or delete an activity
    '''
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class create_activity(generics.CreateAPIView):
    '''
    create a new activity
    '''
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer