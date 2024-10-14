import logging

from django.db import models

from utilities import constants

logger = logging.getLogger(__name__)


class Project(models.Model):
    # Many-to-Many relationship to User
    class Meta:
        db_table = constants.DB_SCHEMA_PREFIX + "project"

    project_id = models.CharField(max_length=25, blank=False, unique=True)
    project_name = models.CharField(max_length=25, blank=True)
    updated = models.DateTimeField(auto_now=True)
    deployment_threshold = models.CharField(max_length=20,
                                            choices=constants.Threshold.choices,
                                            default=constants.Threshold.MEDIUM.name)
    api_key_hash = models.CharField(null=True, max_length=100)

    @property
    def dependency_count(self):
        return self.dependency_set.all().count()

    @property
    def resolved_report_count(self):
        report_resolved = Report.objects.filter(dependency__project=self,
                                                status__in=[constants.Status.NO_THREAT.name,
                                                            constants.Status.THREAT_FIXED.name]).count()

        return report_resolved

    @property
    def solution_distribution(self) -> dict:
        """Counts the number of reports related to this project and group them by solution

        :return: A dictionary containing the solution as key and their number as a value.
        """
        counted_solution = {}
        for solution in constants.Solution.names:
            counted_solution[solution] = Report.objects.filter(dependency__project=self,
                                                               status__in=[constants.Status.NO_THREAT.name,
                                                                           constants.Status.THREAT_FIXED.name],
                                                               solution=solution).count()
        return counted_solution

    @property
    def status_distribution(self) -> dict:
        """Counts the number of reports related to this project and group them by status

        :return: A dictionary containing the statuses as key and their number as a value.
        """
        status_counts = {}

        for status in constants.Status.names:
            counted = Report.objects.filter(dependency__project=self,
                                            dependency__in_use=True,
                                            status=status).count()
            status_counts.update({status: counted})
        return status_counts

    @property
    def calculate_risk_score(self):  # TODO Upcoming update
        """
        The risk_score is the probability that at least one of the given
        vulnerabilities will be exploited.
        """
        cves = CVEObject.objects.filter(report__dependency__project=self).all()

        all_no_exploit_probability = 1

        for cve in cves:
            no_exploit_probability = 1 - cve.epss
            all_no_exploit_probability *= no_exploit_probability

        return 1 - all_no_exploit_probability

    def vulnerabilities_count(self, status_types: list[str]) -> dict:
        """Counts vulnerability severities in project.

        :return: A dict of all severity cases and their number.
        """
        counted_vul = {}

        for severity in constants.BaseSeverity.names:
            counted = 0
            counted += Report.objects.filter(dependency__project=self,
                                             dependency__in_use=True,
                                             cve_object__base_severity=severity,
                                             status__in=status_types).count()
            counted_vul.update({severity: counted})
        return counted_vul


class CVEObject(models.Model):
    class Meta:
        db_table = constants.DB_SCHEMA_PREFIX + "cve_object"

    cve_id = models.CharField(max_length=255, blank=False, unique=True)
    base_severity = models.CharField(max_length=255, default=constants.BaseSeverity.NA.name)
    cvss = models.DecimalField(max_digits=3, decimal_places=1, null=True)
    epss = models.FloatField(null=True, default=0)
    published = models.DateTimeField(null=True)
    updated = models.DateTimeField(null=True)
    description = models.TextField(blank=True)
    attack_vector = models.CharField(choices=constants.AttackVector.choices, max_length=255, blank=True)
    attack_complexity = models.CharField(choices=constants.AttackComplexity.choices, max_length=255, blank=True)
    privileges_required = models.CharField(choices=constants.PrivilegesRequired.choices, max_length=255, blank=True)
    user_interaction = models.CharField(choices=constants.UserInteraction.choices, max_length=255, blank=True)
    confidentiality_impact = models.CharField(choices=constants.ConfidentialityImpact.choices, max_length=255,
                                              blank=True)
    integrity_impact = models.CharField(choices=constants.IntegrityImpact.choices, max_length=255, blank=True)
    availability_impact = models.CharField(choices=constants.AvailabilityImpact.choices, max_length=255, blank=True)
    scope = models.CharField(choices=constants.Scope.choices, max_length=255, blank=True)
    recommended_url = models.CharField(max_length=2048, blank=True)


class Dependency(models.Model):
    class Meta:
        db_table = constants.DB_SCHEMA_PREFIX + "dependency"
        unique_together = (("dependency_name", "version", "project"),)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    dependency_name = models.CharField(max_length=255, blank=False)
    version = models.CharField(max_length=255, blank=False, default="NA")
    package_manager = models.CharField(max_length=255, default="NA")
    license = models.CharField(max_length=255, blank=False, default="NA")
    path = models.CharField(max_length=2048, blank=False, default="NA")
    in_use = models.BooleanField(default=True)


class Report(models.Model):
    class Meta:
        db_table = constants.DB_SCHEMA_PREFIX + "report"
        unique_together = (("dependency", "cve_object"),)

    dependency = models.ForeignKey(Dependency, on_delete=models.CASCADE)
    cve_object = models.ForeignKey(CVEObject, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=constants.Status.choices, default=constants.Status.REVIEW.name)
    update_date = models.DateTimeField(auto_now=True)
    solution = models.CharField(max_length=255, choices=constants.Solution.choices,
                                default=constants.Solution.NO_SOLUTION_NEEDED.name)
    comment = models.TextField(blank=True)
    user = models.ForeignKey("webserver.User", on_delete=models.SET_NULL, null=True)
    score_metric_data = models.TextField(default=constants.DEFAULT_SCORE_METRIC_DATA)
    overall_cvss_score = models.DecimalField(max_digits=3, decimal_places=1, null=True)
    overall_cvss_severity = models.CharField(max_length=255, null=True)
