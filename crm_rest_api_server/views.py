from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework import generics, mixins, viewsets
from rest_framework.authentication import TokenAuthentication

from crm_rest_api_server.models import Roles
from crm_rest_api_server.serializers import RoleSerializer


def index(request):
    return HttpResponse('Hello world')


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Roles.objects.all()

    def list(self, request, *args, **kwargs):
        roles = Roles.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serialized_data = RoleSerializer(data=request.data)
        if serialized_data.is_valid():
            serialized_data.save()
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None, *args, **kwargs):
        retrieved_object = self.queryset.get(pk=pk)
        serializer = RoleSerializer(retrieved_object)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None, *args, **kwargs):
        wanted_role = self.queryset.get(pk=pk)
        serializer = RoleSerializer(wanted_role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    def destroy(self, request, pk=None, *args, **kwargs):
        to_delete = self.queryset.get(pk=pk)
        to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

