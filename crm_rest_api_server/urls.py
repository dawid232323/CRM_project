from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as rf_views

from . import views


router = DefaultRouter()
router.register('roles', views.RoleViewSet, basename='roles')
router.register('users', views.UserViewSet, basename='users')
router.register('deleted_users', views.DeletedUsersViewSet, basename='deleted')

urlpatterns = [
    path('', include(router.urls)),
    path('request_token', rf_views.obtain_auth_token)
    # path('roles/<int:pk>/', RoleViewSet.retrieve),
]
