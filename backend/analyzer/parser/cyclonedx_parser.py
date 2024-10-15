import json
import logging
from typing import cast
from cyclonedx.model.bom import Bom, Component, Vulnerability
from cyclonedx.model.vulnerability import BomTarget
from utilities.exceptions import ParseError
from .types import ParseResult

logger = logging.getLogger(__name__)


def get_package_manager_name(bom_ref: str):
  try:
    # Find the index of the first ":"
    colon_index = bom_ref.index(":")

    # Extract dependency_name from the characters after the first ":"
    start_index = colon_index + 1
    slash_index = bom_ref.index("/", start_index)
    package_manager = bom_ref[start_index:slash_index]
    return package_manager
  except Exception as error:
    logger.warning(str(error))
    return "NA"


def parse_json(json_data: str) -> dict[str, ParseResult]:
  try:
    # deserialize
    bom = cast(Bom, Bom.from_json(data=json.loads(json_data)))
    data: dict[str, ParseResult] = {}

    # key is affected bom-ref and values are vulnerability ids
    vulnerabilities: dict[str, list[str]] = {}

    for vulnerability in bom.vulnerabilities:
      vulnerability = cast(Vulnerability, vulnerability)
      for affected_target in vulnerability.affects:
        affected_target = cast(BomTarget, affected_target)
        target_ref = affected_target.ref
        print(target_ref)
        ref_vulns = vulnerabilities.get(target_ref)
        if ref_vulns is None:
          vulnerabilities[target_ref] = [vulnerability.id]
        else:
          ref_vulns.append(vulnerability.id)

    for component in iter(bom.components):
      component = cast(Component, component)

      licenses: list[str] = []
      for _license in component.licenses:
        if _license is None:
          continue

        license_id = _license.id
        license_name = _license.name

        licenses.append(license_name if license_id is None else license_id)

      component_vulnerability = vulnerabilities.get(component.bom_ref.value)
      data_key = f"{component.name}:{component.version}"
      data[data_key] = ParseResult(dependency_name=component.name,
                                   version="NA" if component.version is None else component.version,
                                   package_manager=get_package_manager_name(
                                     str(component.bom_ref)),
                                   path="NA",
                                   license="NA" if len(licenses) == 0 else
                                   licenses[0],
                                   vulnerabilities=[] if component_vulnerability is None else component_vulnerability)

    return data

  except (KeyError, TypeError, json.decoder.JSONDecodeError) as error:
    error_message = str(error)
    logger.warning(f"Error while parsing JSON file: {error_message}")
    raise ParseError(f"Error while parsing JSON file: {error_message}")
