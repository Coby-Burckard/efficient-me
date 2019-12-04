from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import include
from rest_framework.authtoken import views as auth_token_views

urlpatterns = [
    path('api/activities/', views.LCActivity.as_view()),
    path('api/activities/<int:pk>', views.RUDActivity.as_view()),
    path('api/activitytypes/', views.LCActivityType.as_view()),
    path('api/activitytypes/<int:pk>', views.RUDActivityType.as_view()),
    path('api/goals/', views.LCGoal.as_view()),
    path('api/goals/<int:pk>', views.RUDGoal.as_view()),
    path('api/timeallocations/', views.LCTimeAllocation.as_view()),
    path('api/timeallocations/<int:pk>', views.RUDTimeAllocation.as_view()),
    path('api/createUser/', views.CUser.as_view()),
    path('api/getToken/', auth_token_views.obtain_auth_token)
]

urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns += [
    path('api-auth/', include('rest_framework.urls'))
]
