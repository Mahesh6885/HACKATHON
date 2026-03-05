from django.urls import path
from .views import CertificationListCreateView

urlpatterns = [
    path('', CertificationListCreateView.as_view(), name='certs-list-create'),
]
