from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('create_activity/', views.create_activity.as_view()),
    path('get_delete_activity/<int:pk>', views.get_delete_activity.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)