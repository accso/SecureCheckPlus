from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.db import models
from django.db.models import QuerySet

import utilities.constants as value
from analyzer.models import Project


class User(AbstractBaseUser, PermissionsMixin):
    # Many-to-Many relationship to Project
    class Meta:
        db_table = value.DB_SCHEMA_PREFIX + "user"

    username = models.CharField(max_length=255, unique=True)
    password = None
    notification_threshold = models.CharField(choices=value.Threshold.choices, default=value.Threshold.HIGH.name,
                                              blank=False, max_length=255)
    image_hash = models.CharField(blank=True, max_length=255)
    watched_projects = models.ManyToManyField(Project, through="UserWatchProject")

    USERNAME_FIELD = "username"

    objects = UserManager()

    @property
    def group_list(self):
        return self.groups.all().values_list("name", flat=True)

    def favorite_projects(self) -> QuerySet(Project):
        return self.watched_projects.all().filter(userwatchproject__favorite=True).order_by("project_id")

    def recent_projects(self, number: int = 5) -> QuerySet(Project):
        self._clean_up(number)
        recent = self.watched_projects.all().filter().order_by(
            "-userwatchproject__last_seen")
        return recent

    def _clean_up(self, number: int = 5) -> None:
        if len(self.userwatchproject_set.all()) > number:
            to_be_deleted = self.watched_projects.all().filter(userwatchproject__favorite=False). \
                                order_by("-userwatchproject__last_seen").values_list("project_id", flat=True)[number:]
            print(to_be_deleted)
            UserWatchProject.objects.filter(user_id=self.id,
                                            project__project_id__in=to_be_deleted).delete()


class UserWatchProject(models.Model):
    """
    This is the Many-to-Many relationship between User and Project
    The additional watched_projects property in User is optional.
    It provides easier access through the manager of Django.
    """

    class Meta:
        db_table = value.DB_SCHEMA_PREFIX + "person_watch_project"
        unique_together = (("project", "user"),)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_seen = models.DateTimeField(auto_now=True)
    favorite = models.BooleanField(default=False, null=False)
