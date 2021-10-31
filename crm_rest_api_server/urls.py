from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import RoleViewSet

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='roles')

urlpatterns = [
    path('', include(router.urls)),
    # path('roles/<int:pk>/', RoleViewSet.retrieve),
]
