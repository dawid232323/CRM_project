from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework import generics, mixins, viewsets
from rest_framework.authentication import TokenAuthentication

from crm_rest_api_server.decorators import role_auth_maker, edit_auth
from crm_rest_api_server.models import Roles, CmrUser
from crm_rest_api_server.serializers import RoleSerializer, UserSerializer


def index(request):
    return HttpResponse('Hello world')


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Roles.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    @role_auth_maker({1, 2})
    def list(self, request, *args, **kwargs):
        roles = Roles.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    @role_auth_maker({1})
    def create(self, request, *args, **kwargs):
        serialized_data = RoleSerializer(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @role_auth_maker({1})
    def retrieve(self, request, pk=None, *args, **kwargs):
        retrieved_object = self.queryset.get(pk=pk)
        serializer = RoleSerializer(retrieved_object)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @role_auth_maker({1})
    def update(self, request, pk=None, *args, **kwargs):
        wanted_role = self.queryset.get(pk=pk)
        serializer = RoleSerializer(wanted_role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    @role_auth_maker({1})
    def destroy(self, request, pk=None, *args, **kwargs):
        to_delete = self.queryset.get(pk=pk)
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer  # setting class serializer, in this case it's user
    queryset = CmrUser.objects.all().filter(is_deleted=False)  # setting queryset
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)  # setting authentication,

    # class fields can only be accessed with token

    # method that allows admin (and only admin) to create a new user

    @role_auth_maker({1})  # decorator that specifies which role can access the method
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # method that allows listing all users, all roles have access
    # method does not include deleted users
    # deleted users can be obtained with DeletedUsersViewSet

    @role_auth_maker({1, 2, 3})
    def list(self, request, *args, **kwargs):
        users = self.queryset
        serialized_data = self.serializer_class(users, many=True)
        return Response(serialized_data.data)

    # method that allows to set user as deleted, only admin
    # has access

    @role_auth_maker({1})
    def destroy(self, request, pk=None, *args, **kwargs):
        user_to_delete = get_object_or_404(self.queryset, pk=pk)
        user_to_delete.is_deleted = True
        user_to_delete.save()
        return Response(status=status.HTTP_200_OK)

    # method that allows to update single user
    # only admin and editor have access
    # in addition is_deleted marker cannot be changed here

    # TODO change user serializer so it doesn't require all the fields during the update

    @edit_auth
    def update(self, request, pk=None, *args, **kwargs):
        print(kwargs)
        try:
            user_to_update = self.queryset.get(pk=pk)
        except ObjectDoesNotExist:
            return JsonResponse({"detail": "User might not be active, or present in data base"},
                                status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(user_to_update, data=request.data)
        if serializer.is_valid():
            if 'is_deleted' in request.data.keys():
                return JsonResponse({'Message': 'User cannot be deleted here!'}, status=status.HTTP_400_BAD_REQUEST)
            if kwargs['role'] != 'admin' and int(serializer.validated_data['role_id'].pk) != user_to_update.role_id.pk:
                return JsonResponse({"detail": "Only admin can change user role"},
                                    status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # method that allows to retrieve certain user details
    # if user is deleted, his data can be obtained in DeletedUsersViewSet

    @role_auth_maker({1, 2})
    def retrieve(self, request, pk=None, *args, **kwargs):
        try:
            retrieved_user = self.queryset.get(pk=pk)
            serialized_user = self.serializer_class(retrieved_user)
            return Response(serialized_user.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return JsonResponse({"detail": "User might not be active, or in the data base"},
                                status=status.HTTP_404_NOT_FOUND)


class DeletedUsersViewSet(viewsets.ModelViewSet):   # viewset that handles displaying and interacting with deleted users
    queryset = CmrUser.objects.all().filter(is_deleted=True)
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    @role_auth_maker({1, 2})
    def list(self, request, *args, **kwargs):
        users = self.queryset
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @role_auth_maker({1, 2})
    def retrieve(self, request, pk=None, *args, **kwargs):
        try:
            retr_user = self.queryset.get(pk=pk)
            serializer = self.serializer_class(retr_user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return JsonResponse({"detail": "User might not be deleted or present in the data base"},
                                status=status.HTTP_404_NOT_FOUND)

    @role_auth_maker({1, 2})
    def update(self, request, *args, **kwargs):
        return JsonResponse({"detail": "Deleted user cannot be updated!"},
                            status=status.HTTP_400_BAD_REQUEST)

    @role_auth_maker({1, 2})
    def create(self, request, *args, **kwargs):
        return JsonResponse({"detail": "You cannot create deleted user"},
                            status=status.HTTP_400_BAD_REQUEST)

    @role_auth_maker({1, 2})
    def destroy(self, request, *args, **kwargs):
        return JsonResponse({"detail": "user is already deleted!"},
                            status=status.HTTP_400_BAD_REQUEST)