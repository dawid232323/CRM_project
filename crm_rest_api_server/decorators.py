from rest_framework import status
from rest_framework.response import Response

from crm_rest_api_server.models import CmrUser


# Decorator used to check if current user's role matches
# the given one

def role_auth_maker(role_id):
    def role_auth(view_function):
        def role_auth_wrapper(self, request, *args, **kwargs):
            current_user = CmrUser.objects.get(username=request.user)
            if current_user.role_id.pk in role_id:
                return view_function(self, request, *args, **kwargs)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        return role_auth_wrapper
    return role_auth


# Decorator used in edit methods, here user role is bein passed to the method
# and according to it, the method has different permissions and funcionalities

def edit_auth(view_function):
    def wrapper(self, request, *args, **kwargs):
        current_user = CmrUser.objects.get(username=request.user)
        if current_user.role_id.pk == 1:
            print('confirmed role one')
            return view_function(self, request, *args, **kwargs, role='admin')
        elif current_user.role_id.pk == 2:
            print('confirmed role two')
            return view_function(self, request, *args, **kwargs, role='editor')
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    return wrapper


# Decorator used when user ID is needed in a view function

def user_id_auth(role_ids):
    def user_id_auth_inside(view_function):
        def wrapper(self, request, *args, **kwargs):
            current_user = CmrUser.objects.get(username=request.user)
            if current_user.role_id.pk in role_ids:
                return view_function(self, request, *args, *kwargs, user_id=current_user.pk)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        return wrapper
    return user_id_auth_inside