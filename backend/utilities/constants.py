import urllib.parse as parse
from django.db import models

SERVER_MAIL_ADDRESS = "securecheckplus@thisisnotanofficialmail.de"

NVD_ADDRESS = parse.urlparse("https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=")

EPSS_ADDRESS = parse.urlparse("https://api.first.org/data/v1/epss?cve=")

PROJECT_ADDRESS = parse.urlparse("http://localhost/projects/")

PROFILE_ADDRESS = PROJECT_ADDRESS

DB_SCHEMA_PREFIX = "securecheckplus_"

NA = "N/A"

DEFAULT_SCORE_METRIC_DATA = '[ {"scoreMetricCategoryLabel": "Temporal Score Metrics", "scoreMetrics": [ {"scoreMetricLabel": "Exploit Code Maturity", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Remediation Level", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Report Confidence", "selectedScoreMetricValue": "Not Defined", "comment": ""}]}, {"scoreMetricCategoryLabel": "Environmental Score Metrics - Requirements", "scoreMetrics": [ {"scoreMetricLabel": "Confidentiality Requirement", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Integrity Requirement", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Availability Requirement", "selectedScoreMetricValue": "Not Defined", "comment": ""}]}, {"scoreMetricCategoryLabel": "Environmental Score Metrics - Modifier", "scoreMetrics": [ {"scoreMetricLabel": "Modified Attack Vector", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Attack Complexity", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Privileges Required", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified User Interaction", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Scope", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Confidentiality", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Integrity", "selectedScoreMetricValue": "Not Defined", "comment": ""}, {"scoreMetricLabel": "Modified Availability", "selectedScoreMetricValue": "Not Defined", "comment": ""} ] } ]'

class AccessVector(models.TextChoices):
    LOCAL = "L", "Local"
    ADJACENT_NETWORK = "A", "Adjacent Network"
    NETWORK = "N", "Network"


class AccessComplexity(models.TextChoices):
    HIGH = "H", "High"
    MEDIUM = "M", "Medium"
    LOW = "L", "LOW"


class Authentication(models.TextChoices):
    MULTIPLE = "M", "Multiple"
    SINGLE = "S", "Single"
    NONE = "N", "None"


class ConfidentialityImpactV2(models.TextChoices):
    NONE = "N", "None"
    PARTIAL = "P", "Partial"
    COMPLETE = "C", "Complete"


class IntegrityImpactV2(models.TextChoices):
    NONE = "N", "None"
    PARTIAL = "P", "Partial"
    COMPLETE = "C", "Complete"


class AvailabilityImpactV2(models.TextChoices):
    NONE = "N", "None"
    PARTIAL = "P", "Partial"
    COMPLETE = "C", "Complete"


class AttackVector(models.TextChoices):
    NETWORK = "N", "Network"
    ADJACENT = "A", "Adjacent"
    LOCAL = "L", "Local"
    PHYSICAL = "P", "Physical"


class AttackComplexity(models.TextChoices):
    LOW = "L", "Low"
    HIGH = "H", "High"


class PrivilegesRequired(models.TextChoices):
    NONE = "N", "None"
    LOW = "L", "Low"
    HIGH = "H", "High"


class UserInteraction(models.TextChoices):
    NONE = "N", "None"
    Required = "R", "Required"


class ConfidentialityImpact(models.TextChoices):
    HIGH = "H", "High"
    LOW = "L", "Low"
    NONE = "N", "None"


class IntegrityImpact(models.TextChoices):
    HIGH = "H", "High"
    LOW = "L", "Low"
    NONE = "N", "None"


class AvailabilityImpact(models.TextChoices):
    HIGH = "H", "High"
    LOW = "L", "Low"
    NONE = "N", "None"


class Scope(models.TextChoices):
    UNCHANGED = "U", "Unchanged"
    CHANGED = "C", "Changed"


class Status(models.TextChoices):
    THREAT = "T", "Threat"
    THREAT_WIP = "TWIP", "Threat - Fix is WIP"
    NO_THREAT = "NT", "No Threat"
    THREAT_FIXED = "TF", "Threat fixed"
    REVIEW = "R", "Review"
    REVIEW_AGAIN = "RA", "Review again"


class BaseSeverity(models.IntegerChoices):
    CRITICAL = 5, "Critical"
    HIGH = 4, "High"
    MEDIUM = 3, "Medium"
    LOW = 2, "Low"
    NONE = 1, "None"
    NA = 0, "N/A"


class Threshold(models.IntegerChoices):
    ALWAYS = 6, "Always"  # Always prevent deployment/notification
    CRITICAL = 5, "Critical"
    HIGH = 4, "High"
    MEDIUM = 3, "Medium"
    LOW = 2, "Low"
    NONE = 1, "None"
    NEVER = 0, "Never"  # Never prevent deployment/notification


class Solution(models.TextChoices):
    NO_SOLUTION_NEEDED = "No solution needed"
    CHANGE_VERSION = "Change version"
    CHANGE_DEPENDENCY = "Change dependency"
    PROGRAMMING = "Programming required"
    NO_SOLUTION = "No solution available"
