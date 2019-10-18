from django.contrib import admin
from .models import Activity, ActivityType, Goal, TimeAllocation

# Register your models here.

@admin.register(ActivityType, Activity, Goal, TimeAllocation)
class AdminAdmin(admin.ModelAdmin):
    pass


