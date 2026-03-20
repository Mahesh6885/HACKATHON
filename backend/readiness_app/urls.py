from django.urls import path
from .views import DashboardMetricsView

urlpatterns = [
    path('dashboard-stats/', DashboardMetricsView.as_view(), name='dashboard-stats'),
]
