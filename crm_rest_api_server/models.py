from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    login = models.CharField(max_length=20)
    # password =


class Roles(models.Model):
    role_name = models.CharField(max_length=100)
    

class Business(models.Model):
    business_name = models.CharField(max_length=100)


