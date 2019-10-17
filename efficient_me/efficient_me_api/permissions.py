from rest_framework import permissions

class IsOwnerOrBackOff(permissions.BasePermission):
    '''
    Custom permission to only allow the user to view, edit, or delete objects
    '''

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user