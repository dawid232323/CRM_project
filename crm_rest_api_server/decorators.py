from rest_framework import status
from rest_framework.response import Response

from crm_rest_api_server.models import CmrUser


def role_auth(view_function):
    def role_auth_wrapper(self, request, *args, **kwargs):
        print(f'request is {request}')
        current_user = CmrUser.objects.get(username=request.user)
        if current_user.role_id.pk == 2:
            print(f'role id is {current_user.role_id.pk}')
            return view_function(self, request, *args, **kwargs)
        else:
            print(f'role id is {current_user.role_id.pk}')
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    return role_auth_wrapper
