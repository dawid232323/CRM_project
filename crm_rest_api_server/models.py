from django.db import models
from django.contrib.auth.models import User

# TODO add companies, trade note, contact person


class Roles(models.Model):
    role_name = models.CharField(max_length=100)


class CmrUser(User):
    # present fields: first_name, last_name, username
    date_of_birth = models.DateField()
    role_id = models.ForeignKey(Roles, on_delete=models.CASCADE)


class Business(models.Model):
    business_name = models.CharField(max_length=100)
