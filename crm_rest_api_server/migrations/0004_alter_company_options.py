# Generated by Django 3.2.8 on 2021-11-06 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crm_rest_api_server', '0003_company'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='company',
            options={'ordering': ['-id']},
        ),
    ]
