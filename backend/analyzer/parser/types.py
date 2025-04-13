from dataclasses import dataclass


@dataclass
class ParseResult:
    dependency_name: str
    version: str
    path: str
    license: str
    vulnerabilities: list[str]
    package_manager: str
    cpe_ids: list[str]
