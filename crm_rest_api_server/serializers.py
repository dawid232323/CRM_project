from rest_framework import serializers

from crm_rest_api_server.models import CmrUser, Roles, Business, Company, TradeNote, ContactPerson
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

    # def update(self, instance: CmrUser, validated_data):
    #     pass


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id', 'role_name']


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'business_name']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        extra_kwargs = {
            'company_added_by': {
                'required': False
            },
            'company_is_deleted': {
                'required': False
            }
        }

    def update(self, instance: Company, validated_data):
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.company_nip = validated_data.get('company_nip', instance.company_nip)
        instance.company_business = validated_data.get('company_business', instance.company_business)
        instance.company_address = validated_data.get('company_address', instance.company_address)
        instance.company_city = validated_data.get('company_city', instance.company_city)
        return instance


class TradeNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeNote
        fields = '__all__'
        extra_kwargs = {
            'note_added_by': {
                'required': False
            },
            'note_is_deleted': {
                'required': False
            }

        }

    def update(self, instance: TradeNote, validated_data):
        instance.note_contents = validated_data.get('note_contents', instance.note_contents)
        instance.note_company_id = validated_data.get('note_company_id', instance.note_company_id)
        return instance


class ContactPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPerson
        fields = '__all__'

