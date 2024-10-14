import pytest

from django.core import mail

from analyzer.models import Project, Dependency, Report, CVEObject
from webserver.models import User, UserWatchProject
from analyzer.manager import notification_manager
from utilities.constants import Threshold


@pytest.mark.django_db()
class TestNotificationManager:

    @pytest.fixture()
    def db(self):
        self.project = Project.objects.create(project_id="Test", deployment_threshold=Threshold.HIGH.name)
        dependency = Dependency.objects.create(project=self.project, dependency_name="math.js")
        cve_object = CVEObject.objects.create(cve_id="Test123", base_severity=Threshold.HIGH.name)
        Report.objects.create(dependency=dependency, cve_object=cve_object)
        self.user = User.objects.create(username="test@acme.de", notification_threshold=Threshold.LOW.name)
        self.user2 = User.objects.create(username="test2@acme.de", notification_threshold=Threshold.CRITICAL.name)
        UserWatchProject.objects.create(project=self.project, user=self.user)
        UserWatchProject.objects.create(project=self.project, user=self.user2)

    def test_find_person(self, db):
        assert len(notification_manager._find_persons_to_be_notified(self.project)) == 1
        assert self.user == notification_manager._find_persons_to_be_notified(self.project)[0]

    def test_mail_sent(self, db):
        notification_manager.notify(self.project)
        assert len(mail.outbox) == 1
        assert mail.outbox[0].recipients()[0] == self.user.username
