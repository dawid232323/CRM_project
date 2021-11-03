from rest_framework import serializers

from crm_rest_api_server.models import CmrUser, Roles
from rest_framework.authtoken.views import Token

# TODO add token authorization to UserSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CmrUser
        fields = ['id', 'username', 'first_name', 'last_name',
                  'password', 'date_of_birth', 'role_id', 'is_deleted',]
        extra_kwargs = {'password': {
            'write_only': True,
            'required': True
        }}

    def create(self, validated_data):
        new_user = CmrUser.objects.create_user(**validated_data)
        Token.objects.create(user=new_user)
        return new_user


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id', 'role_name']



