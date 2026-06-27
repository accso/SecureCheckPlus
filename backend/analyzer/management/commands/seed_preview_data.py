"""
Django management command: seed_preview_data
--------------------------------------------
Creates a demo project "SecureCheckPlus" with realistic dependency and CVE
data so the preview environment shows a populated dashboard out of the box.

The command is idempotent: running it multiple times is safe.
It is called automatically by entrypoint.sh when IS_DEV=True.
"""
import datetime

from django.core.management.base import BaseCommand

from analyzer.models import Project, Dependency, CVEObject, Report
from utilities.constants import (
    BaseSeverity, Status, Solution, Threshold,
    AttackVector, AttackComplexity, PrivilegesRequired,
    UserInteraction, ConfidentialityImpact, IntegrityImpact,
    AvailabilityImpact, Scope,
)


DEMO_PROJECT = {
    "project_id": "securecheckplus",
    "project_name": "SecureCheckPlus",
    "deployment_threshold": Threshold.MEDIUM.name,
}

DEMO_DEPENDENCIES = [
    ("bootstrap",          "3.3.6",  "javascript", "MIT",   "frontend/node_modules/bootstrap"),
    ("jquery",             "1.11.1", "javascript", "MIT",   "frontend/node_modules/jquery"),
    ("axios",              "0.26.0", "javascript", "MIT",   "frontend/node_modules/axios"),
    ("react",              "17.0.2", "javascript", "MIT",   "frontend/node_modules/react"),
    ("react-dom",          "17.0.2", "javascript", "MIT",   "frontend/node_modules/react-dom"),
    ("react-query",        "3.34.16","javascript", "MIT",   "frontend/node_modules/react-query"),
    ("react-router-dom",   "6.2.2",  "javascript", "MIT",   "frontend/node_modules/react-router-dom"),
    ("webpack",            "5.70.0", "javascript", "MIT",   "frontend/node_modules/webpack"),
    ("Django",             "5.1.2",  "python",     "BSD-3", "backend/requirements.txt"),
    ("djangorestframework","3.15.2", "python",     "BSD-3", "backend/requirements.txt"),
    ("django-cors-headers","4.5.0",  "python",     "MIT",   "backend/requirements.txt"),
    ("requests",           "2.32.3", "python",     "Apache-2.0", "backend/requirements.txt"),
    ("lxml",               "5.3.0",  "python",     "BSD-3", "backend/requirements.txt"),
    ("whitenoise",         "6.7.0",  "python",     "MIT",   "backend/requirements.txt"),
]

DEMO_CVES = [
    (
        "CVE-2016-10735", BaseSeverity.MEDIUM.name, 6.1, 0.00384,
        "In Bootstrap 3.x before 3.4.0, XSS is possible in the data-target attribute.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://github.com/twbs/bootstrap/pull/27033",
        datetime.datetime(2019, 1, 9, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2018-14040", BaseSeverity.MEDIUM.name, 6.1, 0.00461,
        "In Bootstrap before 4.1.2, XSS is possible in the collapse data-parent attribute.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://github.com/twbs/bootstrap/issues/26630",
        datetime.datetime(2018, 7, 13, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2019-8331", BaseSeverity.MEDIUM.name, 6.1, 0.00512,
        "In Bootstrap before 3.4.1 and 4.3.x before 4.3.1, XSS is possible in the "
        "tooltip or popover data-template attribute.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://blog.getbootstrap.com/2019/02/13/bootstrap-4-3-1-and-3-4-1/",
        datetime.datetime(2019, 2, 20, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2015-9251", BaseSeverity.MEDIUM.name, 6.1, 0.00698,
        "jQuery before 3.0.0 is vulnerable to Cross-site Scripting (XSS) attacks when a "
        "cross-domain Ajax request is performed without the dataType option.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://github.com/jquery/jquery/commit/753d591",
        datetime.datetime(2018, 1, 18, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2019-11358", BaseSeverity.MEDIUM.name, 6.1, 0.01174,
        "jQuery before 3.4.0 mishandles jQuery.extend(true, {}, ...) because of "
        "Object.prototype pollution, allowing attackers to modify Object.prototype.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://github.com/jquery/jquery/commit/753d591",
        datetime.datetime(2019, 4, 20, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2020-11022", BaseSeverity.MEDIUM.name, 6.9, 0.01987,
        "In jQuery versions greater than or equal to 1.2 and before 3.5.0, "
        "passing HTML from untrusted sources to jQuery's DOM manipulation methods may execute untrusted code.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.Required.value, ConfidentialityImpact.LOW.value,
        IntegrityImpact.LOW.value, AvailabilityImpact.NONE.value, Scope.CHANGED.value,
        "https://github.com/jquery/jquery/security/advisories/GHSA-gxr4-xjj5-5px2",
        datetime.datetime(2020, 4, 29, tzinfo=datetime.timezone.utc),
    ),
    (
        "CVE-2021-3749", BaseSeverity.HIGH.name, 7.5, 0.00433,
        "axios before 0.21.2 is vulnerable to Regular Expression Denial of Service (ReDoS) "
        "via the trim function.",
        AttackVector.NETWORK.value, AttackComplexity.LOW.value, PrivilegesRequired.NONE.value,
        UserInteraction.NONE.value, ConfidentialityImpact.NONE.value,
        IntegrityImpact.NONE.value, AvailabilityImpact.HIGH.value, Scope.UNCHANGED.value,
        "https://github.com/axios/axios/releases/tag/v0.21.2",
        datetime.datetime(2021, 8, 31, tzinfo=datetime.timezone.utc),
    ),
]

DEMO_REPORTS = [
    ("CVE-2016-10735", "bootstrap", "3.3.6", Status.THREAT.name,     Solution.CHANGE_VERSION, "Upgrade to bootstrap >= 3.4.1."),
    ("CVE-2018-14040", "bootstrap", "3.3.6", Status.REVIEW.name,     Solution.NO_SOLUTION_NEEDED, ""),
    ("CVE-2019-8331",  "bootstrap", "3.3.6", Status.THREAT_FIXED.name, Solution.CHANGE_VERSION, "Fixed by upgrading to 4.x in next sprint."),
    ("CVE-2015-9251",  "jquery",    "1.11.1", Status.THREAT.name,    Solution.CHANGE_VERSION, "Upgrade to jquery >= 3.5.0."),
    ("CVE-2019-11358", "jquery",    "1.11.1", Status.REVIEW.name,    Solution.NO_SOLUTION_NEEDED, ""),
    ("CVE-2020-11022", "jquery",    "1.11.1", Status.THREAT_WIP.name, Solution.CHANGE_VERSION, "Migration to jquery 3.x in progress."),
    ("CVE-2021-3749",  "axios",     "0.26.0", Status.THREAT.name,    Solution.CHANGE_VERSION, "Upgrade to axios >= 0.21.2."),
]


class Command(BaseCommand):
    help = "Seeds the preview database with a demo 'SecureCheckPlus' project and sample vulnerability data."

    def handle(self, *args, **options):
        self.stdout.write("Seeding preview data ...")

        project, created = Project.objects.get_or_create(
            project_id=DEMO_PROJECT["project_id"],
            defaults={
                "project_name": DEMO_PROJECT["project_name"],
                "deployment_threshold": DEMO_PROJECT["deployment_threshold"],
            },
        )
        if created:
            self.stdout.write(f"  ✓ Created project '{project.project_id}'")
        else:
            self.stdout.write(f"  · Project '{project.project_id}' already exists – skipping.")

        dep_map: dict[tuple, Dependency] = {}
        for dep_name, version, pkg_mgr, lic, path in DEMO_DEPENDENCIES:
            dep, dep_created = Dependency.objects.get_or_create(
                project=project,
                dependency_name=dep_name,
                version=version,
                defaults={
                    "package_manager": pkg_mgr,
                    "license": lic,
                    "path": path,
                    "in_use": True,
                },
            )
            dep_map[(dep_name, version)] = dep
            if dep_created:
                self.stdout.write(f"  ✓ Dependency {dep_name}@{version}")

        cve_map: dict[str, CVEObject] = {}
        for (cve_id, severity, cvss, epss, desc,
             av, ac, pr, ui, ci, ii, ai, scope, url, published) in DEMO_CVES:
            cve, cve_created = CVEObject.objects.get_or_create(
                cve_id=cve_id,
                defaults={
                    "base_severity": severity,
                    "cvss": cvss,
                    "epss": epss,
                    "description": desc,
                    "attack_vector": av,
                    "attack_complexity": ac,
                    "privileges_required": pr,
                    "user_interaction": ui,
                    "confidentiality_impact": ci,
                    "integrity_impact": ii,
                    "availability_impact": ai,
                    "scope": scope,
                    "recommended_url": url,
                    "published": published,
                    "updated": published,
                },
            )
            cve_map[cve_id] = cve
            if cve_created:
                self.stdout.write(f"  ✓ CVE {cve_id}")

        for cve_id, dep_name, dep_version, status, solution, comment in DEMO_REPORTS:
            dep = dep_map.get((dep_name, dep_version))
            cve = cve_map.get(cve_id)
            if not dep or not cve:
                continue
            _, report_created = Report.objects.get_or_create(
                dependency=dep,
                cve_object=cve,
                defaults={
                    "status": status,
                    "solution": solution,
                    "comment": comment,
                },
            )
            if report_created:
                self.stdout.write(f"  ✓ Report {dep_name}@{dep_version} → {cve_id} [{status}]")

        self.stdout.write(self.style.SUCCESS("Preview data seeding complete."))
