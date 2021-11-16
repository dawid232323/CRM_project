from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as rf_views

from . import views


router = DefaultRouter()
router.register('roles', views.RoleViewSet, basename='roles')
router.register('users', views.UserViewSet, basename='users')
router.register('deleted_users', views.DeletedUsersViewSet, basename='deleted')
router.register('business', views.BusinessViewSet, basename='business')
router.register('companies', views.CompaniesViewSet, basename='companies')
router.register('notes', views.TradeNoteViewSet, basename='trade notes')
router.register('contacts', views.ContactPersonViewSet, basename='contact person')
router.register('user_token_details', views.shortUserDetails, basename='short_user')

urlpatterns = [
    path('', include(router.urls)),
    path('request_token/', rf_views.obtain_auth_token),
    path('filter/<str:filter_object>_<str:filter_by>=<str:filter_condition>/', views.FilterViewSet.as_view({'get': 'list'})),

    # path('users/', views.UserViewSet.as_view({'get': 'list'}))
    # path('roles/<int:pk>/', RoleViewSet.retrieve),
]
