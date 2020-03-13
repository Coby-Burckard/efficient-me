from rest_framework import permissions

class IsOwnerOrBackOff(permissions.BasePermission):
    '''
    Custom permission to only allow the user to view, edit, or delete objects
    '''

    def has_object_permission(self, request, view, obj):
        print('checking permissions ', request.user, obj.user)
        return obj.user == request.user