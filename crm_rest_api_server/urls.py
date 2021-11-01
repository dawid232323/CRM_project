from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as rf_views

from . import views
from .views import RoleViewSet, UserViewSet

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='roles')
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('request_token', rf_views.obtain_auth_token)
    # path('roles/<int:pk>/', RoleViewSet.retrieve),
]
