from django.contrib import admin

# Register your models here.
from crm_rest_api_server.models import CmrUser, Company


@admin.register(CmrUser)
class UserModel(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'username', 'date_of_birth',
                    'role_id', 'is_deleted')


@admin.register(Company)
class CompanyModel(admin.ModelAdmin):
    list_display = [field.name for field in Company._meta.fields if field.name != 'id']
