# Generated by Django 4.0.3 on 2022-04-06 08:29
import logging

from django.contrib.auth.management import create_permissions
from django.db import migrations


def init_groups(apps, schema_editor):
    """Initialize default groups if no groups where found."""

    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, verbosity=0)
        app_config.models_module = None

    Group = apps.get_model("auth", "Group")
    ContentType = apps.get_model("contenttypes", "ContentType")
    Permission = apps.get_model("auth", "Permission")

    content_type_project = ContentType.objects.get(app_label="analyzer", model="project")
    content_type_user = ContentType.objects.get(app_label="webserver", model="user")
    content_type_userwatchproject = ContentType.objects.get(app_label="webserver", model="userwatchproject")
    content_type_report = ContentType.objects.get(app_label="analyzer", model="report")

    base_permissions = [Permission.objects.get(codename="change_user", content_type=content_type_user),
                        Permission.objects.get(codename="change_userwatchproject",
                                               content_type=content_type_userwatchproject)]

    advanced_permissions = base_permissions + [
        Permission.objects.get(codename="change_report", content_type=content_type_report),
        Permission.objects.get(codename="change_project", content_type=content_type_project)]

    Group.objects.get_or_create(name="basic")[0].permissions.set(base_permissions)
    Group.objects.get_or_create(name="advanced")[0].permissions.set(advanced_permissions)
    Group.objects.get_or_create(name="admin")[0].permissions.set(Permission.objects.all())
    logging.getLogger(__name__).info("Groups have been initialized.")


class Migration(migrations.Migration):
    dependencies = [
        ('webserver', '0001_initial'),
        ("auth", "__latest__"),
        ("contenttypes", "__latest__")
    ]

    operations = [
        migrations.RunPython(init_groups)
    ]