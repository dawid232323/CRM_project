from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination

from crm_rest_api_server.decorators import role_auth_maker, edit_auth, user_id_auth, filtering_auth, function_authorizer
from crm_rest_api_server.models import Roles, CmrUser, Business, Company, TradeNote, ContactPerson
from crm_rest_api_server.serializers import RoleSerializer, UserSerializer, BusinessSerializer, CompanySerializer, \
    TradeNoteSerializer, ContactPersonSerializer


class shortUserDetails(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = CmrUser.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def list(self, request, *args, **kwargs):
        wanted_user = get_object_or_404(CmrUser, username=request.user)
        return JsonResponse({
            "username": f'{wanted_user.username}',
            "role": f'{wanted_user.role_id.pk}',
            "user_id": f'{wanted_user.pk}'
        }, status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Roles.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)
    pagination_class = PageNumberPagination

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


class UserPagination(PageNumberPagination):
    page_size = 2


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer  # setting class serializer, in this case it's user
    queryset = CmrUser.objects.all().filter(is_deleted=False)  # setting queryset
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)  # setting authentication,
    pagination_class = PageNumberPagination

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
        response = super(UserViewSet, self).list(self, request)
        return response

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


class DeletedUsersViewSet(viewsets.ModelViewSet):  # viewset that handles displaying and interacting with deleted users
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


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    pagination_class = UserPagination
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def list(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompaniesViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    @user_id_auth({1, 2})
    def create(self, request, *args, **kwargs):
        request.data['company_added_by'] = kwargs['user_id']
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __companies_getter(self, fil_by, condition):
        if fil_by == 'company_name':
            wanted_companies = self.paginate_queryset(
                self.queryset.filter(company_name__contains=condition)
            )
        elif fil_by == 'company_business':
            wanted_companies = self.paginate_queryset(
                self.queryset.filter(company_business__business_name__contains=condition)
            )
        elif fil_by == 'company_city':
            wanted_companies = self.paginate_queryset(
                self.queryset.filter(company_city__contains=condition)
            )
        return wanted_companies

    # You don't have to filter by exact value of the paremeter
    # Filtering handles regex

    @filtering_auth()
    def list(self, request, *args, **kwargs):
        wanted_companies = None
        if request.query_params.__contains__("deleted"):
            param = request.query_params.__getitem__("deleted")
            if param == 'True':
                print('true')
                wanted_companies = self.paginate_queryset(queryset=self.queryset)
            else:
                print('false')
                wanted_companies = self.paginate_queryset(queryset=self.queryset.filter(company_is_deleted=False))
        serializer = self.serializer_class(wanted_companies, many=True)
        return self.get_paginated_response(serializer.data)

    @role_auth_maker({1, 2})
    def retrieve(self, request, pk=None, *args, **kwargs):
        return super(CompaniesViewSet, self).retrieve(self, request, pk=None, *args, **kwargs)

    @role_auth_maker({1})
    def destroy(self, request, pk=None, *args, **kwargs):
        comp_to_delete = self.queryset.get(pk=pk)
        comp_to_delete.company_is_deleted = True
        comp_to_delete.save()
        return Response(self.serializer_class(comp_to_delete).data, status=status.HTTP_200_OK)

    # @edit_auth
    # def update(self, request, pk=None, *args, **kwargs):
    #     response = super().update(self, request, pk=pk)
    #     return response


class TradeNoteViewSet(viewsets.ModelViewSet):
    queryset = TradeNote.objects.all()
    serializer_class = TradeNoteSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    @user_id_auth({1, 2})
    def create(self, request, *args, **kwargs):
        request.data['note_added_by'] = kwargs['user_id']
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print('serializer is valid')
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def __get_filtered_list(self, fil_by, condition):
        if fil_by == 'note_company_id':
            wanted_notes = self.paginate_queryset(queryset=self.queryset.filter(
                note_company_id=condition
            ))
            return wanted_notes
        elif fil_by == 'note_company_name':
            wanted_notes = self.paginate_queryset(queryset=self.queryset.filter(
                note_company_id__company_name__contains=condition
            ))
            return wanted_notes
        elif fil_by == 'id':
            wanted_notes = self.paginate_queryset(queryset=self.queryset.filter(
                pk=condition
            ))
            return wanted_notes
        else:
            raise ObjectDoesNotExist

    @filtering_auth()
    def list(self, request, *args, **kwargs):
        if kwargs['filter_by'] and kwargs['filter_condition']:
            try:
                wanted_notes = self.__get_filtered_list(kwargs['filter_by'], kwargs['filter_condition'])
            except ObjectDoesNotExist:
                return JsonResponse({"detail": "Check your request body"}, status=status.HTTP_400_BAD_REQUEST)
        elif (not kwargs['filter_by'] and kwargs['filter_condition']) or \
                (not kwargs['filter_condition'] and kwargs['filter_by']):
            return JsonResponse({"detail": "Check your request body"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            wanted_notes = self.paginate_queryset(queryset=self.queryset)
        return self.get_paginated_response(self.serializer_class(wanted_notes, many=True).data)

    @edit_auth
    def update(self, request, pk=None, *args, **kwargs):
        note_to_update: TradeNote = get_object_or_404(TradeNote, pk=pk)
        serializer = self.serializer_class(note_to_update, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @role_auth_maker({1})
    def destroy(self, request, pk=None, *args, **kwargs):
        note_to_delete = get_object_or_404(TradeNote, pk=pk)
        note_to_delete.note_is_deleted = True
        note_to_delete.save()
        return Response(status=status.HTTP_200_OK)


class ContactPersonViewSet(viewsets.ModelViewSet):
    queryset = ContactPerson.objects.all()
    serializer_class = ContactPersonSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    @user_id_auth({1, 2})
    def create(self, request, *args, **kwargs):
        print(request.data)
        request.data['contact_added_by'] = kwargs['user_id']
        serialised_data = self.serializer_class(data=request.data)
        if serialised_data.is_valid():
            serialised_data.save()
            return Response(serialised_data.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialised_data.errors, status=status.HTTP_400_BAD_REQUEST)

    def __response_generator(self, fil_by, condition):
        if fil_by == 'contact_surname':
            wanted_contacts = self.paginate_queryset(self.queryset.filter(contact_surname__contains=condition))
            return self.get_paginated_response(self.serializer_class(wanted_contacts, many=True).data)
        else:
            return JsonResponse({"detail": f"No elements with {fil_by} filter by {condition}"},
                                status=status.HTTP_400_BAD_REQUEST)

    @filtering_auth()
    def list(self, request, *args, **kwargs):
        if kwargs['filter_by'] and kwargs['filter_condition']:
            return self.__response_generator(kwargs['filter_by'], kwargs['filter_condition'])
        else:
            contacts = self.paginate_queryset(queryset=self.queryset)
            return self.get_paginated_response(self.serializer_class(contacts, many=True).data)

    @role_auth_maker({1, 2})
    def update(self, request, pk=None, *args, **kwargs):
        retrieved_contact = get_object_or_404(ContactPerson, pk=pk)
        serialzer = self.serializer_class(retrieved_contact, data=request.data)
        if serialzer.is_valid():
            serialzer.save()
            return Response(serialzer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialzer.errors, status=status.HTTP_400_BAD_REQUEST)

    @role_auth_maker({1})
    def destroy(self, request, pk=None, *args, **kwargs):
        contact_to_delete = get_object_or_404(ContactPerson, pk=pk)
        contact_to_delete.contact_is_deleted = True
        contact_to_delete.save()
        return Response(status=status.HTTP_200_OK)


class FilterViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer  # setting class serializer, in this case it's user
    queryset = CmrUser.objects.all().filter(is_deleted=False)  # setting queryset
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)  # setting authentication,
    pagination_class = PageNumberPagination

    def __filter_users(self, filter_condition, filter_by):
        wanted_users = None
        if filter_condition == 'username':
            wanted_users = self.paginate_queryset(CmrUser.objects.all().filter(username__contains=filter_by))
        elif filter_condition == 'last_name':
            wanted_users = self.paginate_queryset(CmrUser.objects.all().filter(last_name__contains=filter_by))
        elif not wanted_users:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(wanted_users, many=True)
        return self.get_paginated_response(serializer.data)
        # return self.get_paginated_response(serializer.data)

    def __filter_companies(self, filter_condition, filter_by):
        wanted_companies = None
        print(f'filter condition is {filter_condition} filter by is {filter_by}')
        if filter_condition == 'businessName':
            print('entered condition')
            wanted_companies = self.paginate_queryset(Company.objects.all().filter(company_business__business_name__contains=filter_by))
        elif filter_condition == 'businessID':
            wanted_companies = self.paginate_queryset(Company.objects.all().filter(company_business__contains=filter_by))
        elif filter_by == 'date':
            pass
        serializer = CompanySerializer(wanted_companies, many=True)
        print(serializer.data)
        return self.get_paginated_response(serializer.data)

    def __filter_contacts(self, filter_condition, filter_by):
        wanted_contacts = None
        if filter_condition == 'surname':
            wanted_contacts = self.paginate_queryset(ContactPerson.objects.filter(contact_surname__contains=filter_by))
        serializer = ContactPersonSerializer(wanted_contacts, many=True)
        return self.get_paginated_response(serializer.data)

    @role_auth_maker({1, 2, 3})
    def list(self, request, filter_object=None, filter_by=None, filter_condition=None, *args, **kwargs):
        print(f'{filter_object} {filter_by} {filter_condition}')
        if filter_object == 'users':
            return self.__filter_users(filter_by, filter_condition)
        elif filter_object == 'companies':
            print('entering first if')
            return self.__filter_companies(filter_by, filter_condition)
        elif filter_object == 'contacts':
            return self.__filter_contacts(filter_by, filter_condition)


def short_companies(request):
    companies = list(Company.objects.values('id', 'company_name'))
    # serializer = CompanySerializer(companies, many=True)
    print(companies)
    return JsonResponse(companies, safe=False)

