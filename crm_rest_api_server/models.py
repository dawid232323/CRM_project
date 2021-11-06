from django.db import models
from django.contrib.auth.models import User

# TODO add companies, trade note, contact person


class Roles(models.Model):
    role_name = models.CharField(max_length=100)


class CmrUser(User):
    # present fields: first_name, last_name, username
    date_of_birth = models.DateField()
    role_id = models.ForeignKey(Roles, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(default=False)


class Business(models.Model):
    business_name = models.CharField(max_length=100)


class Company(models.Model):
    class Meta:
        ordering = ['-id']
    company_name = models.CharField(max_length=200)
    company_nip = models.CharField(max_length=10)
    company_business = models.ForeignKey(Business, on_delete=models.CASCADE)
    company_address = models.CharField(max_length=100, default=None)
    company_city = models.CharField(max_length=50, default=None)
    company_added_by = models.ForeignKey(CmrUser, on_delete=models.CASCADE)
    company_is_deleted = models.BooleanField(default=False)


class TradeNote(models.Model):
    class Meta:
        ordering = ['-id']
    note_contents = models.TextField(max_length=1000)
    note_is_deleted = models.BooleanField(default=False)
    note_company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    note_added_by = models.ForeignKey(CmrUser, on_delete=models.CASCADE)


class ContactPerson(models.Model):
    class Meta:
        ordering = ['-id']
    contact_name = models.CharField(max_length=100)
    contact_surname = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=9)
    contact_mail = models.EmailField()
    contact_position = models.CharField(max_length=100)
    contact_company = models.ForeignKey(Company, on_delete=models.CASCADE)
    contact_added_by = models.ForeignKey(CmrUser, on_delete=models.CASCADE)
    contact_is_deleted = models.BooleanField(default=False)

