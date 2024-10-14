from django.db.utils import IntegrityError
from django.test import TestCase

from analyzer.models import Project
from utilities.constants import Threshold
from webserver.models import User, UserWatchProject


class UserWatchProjectTestCase(TestCase):
    def setUp(self):
        self.project_id = "SECURECHECKPLUS"
        self.project_name = "SecureCheckPlus"
        Project.objects.create(project_id=self.project_id, project_name=self.project_name)
        user = User.objects.create(username="User1@acme.de")
        user2 = User.objects.create(username="User2@acme.de")
        project = Project.objects.get(project_id=self.project_id)
        UserWatchProject.objects.create(user=user, project=project)
        UserWatchProject.objects.create(user=user2, project=project)

    # Test if saved - Project can have multiple users
    def test_project_have_multiple_user(self):
        self.assertEqual(2, len(UserWatchProject.objects.all()))

    # Test if associated Entities are properly deleted
    def test_delete_cascade(self):
        Project.objects.get(project_id=self.project_id).delete()
        self.assertEqual(0, len(UserWatchProject.objects.all()))


class UserTestCase(TestCase):
    def setUp(self):
        self.email = "user@acme.de"
        user = User.objects.create(username=self.email, notification_threshold=Threshold.CRITICAL.name)
        project = Project.objects.create(project_id="Test1")
        project2 = Project.objects.create(project_id="Test2")
        UserWatchProject.objects.create(user=user, project=project)
        UserWatchProject.objects.create(user=user, project=project2)

    # Test if Entity is properly saved
    def test_save_user(self):
        user = User.objects.get(username=self.email)
        self.assertEqual(user.username, self.email)

    # Test if many-to-many relationship is properly saved
    def test_user_have_multiple_object(self):
        self.assertEqual(2, len(UserWatchProject.objects.all()))

    # Test if unique constraint will trigger
    def test_unique_email(self):
        try:
            User.objects.create(username=self.email)
            self.assertTrue(False)
        except IntegrityError:
            self.assertTrue(True)

    # Test if Entity is deleted properly
    def test_delete_user(self):
        User.objects.get(username=self.email).delete()
        self.assertEqual(0, len(User.objects.filter(username=self.email)))

    # Test if associated Entities will delete properly
    def test_delete_cascade(self):
        User.objects.get(username=self.email).delete()
        self.assertEqual(0, len(UserWatchProject.objects.all()))

    def test_favorites(self):
        user = User.objects.get(username=self.email)
        self.assertEqual(len(user.favorite_projects()), 0)

        user_watch_project = UserWatchProject.objects.get(user=user, project__project_id="Test1")
        user_watch_project.favorite = True
        user_watch_project.save()
        self.assertEqual(len(user.favorite_projects()), 1)

    def test_clean_up_and_recent_projects(self):
        user = User.objects.get(username=self.email)
        user._clean_up(5)
        self.assertEqual(len(user.recent_projects()), 2)

        user._clean_up(1)
        self.assertEqual(len(user.recent_projects()), 1)
