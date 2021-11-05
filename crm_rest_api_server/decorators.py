from rest_framework import status
from rest_framework.response import Response

from crm_rest_api_server.models import CmrUser


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
