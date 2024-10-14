import hashlib
import traceback

from utilities.constants import BaseSeverity
from securecheckplus.settings import SALT


def log_internal_error(logger, request, description: str or Exception):
    return logger.error(
        f"Following error occurred during {request.META.get('HTTP_REFERER')} - {request.get_full_path()} called by "
        f"{hash_string(word=request.user.username, salt=SALT)}({request.META.get('HTTP_X_FORWARDED_FOR')}): "
        f"{description} - {traceback.format_exc()}")


def vulnerabilities_in_percentage(counted_vulnerabilities: dict) -> dict:
    """Calculates the percentage based on counted vulnerabilities.

    :param: counted_vulnerabilities: The severities with their number of occurrences.
    :type: counted_vulnerabilities: dict
    :return: A dict of all severity cases and their percentage
    :rtype: dict
    """

    per_vulnerabilities = {}

    sum_vulnerabilities = sum(counted_vulnerabilities.values())

    for severity in BaseSeverity.names:
        if sum_vulnerabilities == 0:
            percentage = "-"
        else:
            percentage = round(counted_vulnerabilities[severity] / sum_vulnerabilities * 100, 1)
        per_vulnerabilities.update({f"{severity}_per": percentage})
    return per_vulnerabilities


def hash_string(word: str, salt: str, length: int = 10) -> str:
    """Generates a hash of a given string and the given salt, using Blake's hash algorithm.

    :param: word: A string to be hashed
    :type: word: str
    :param: salt: A salt value for the string to be hashed with.
    :type: str
    :return: A hash as a string of the given input of length 20.
    """
    blake = hashlib.blake2b(salt=salt.encode("utf-8"), digest_size=length)
    blake.update(word.encode("utf-8"))
    return blake.hexdigest()


def hash_key(key: str) -> hex:
    """Hashes the key with sha3_256

    :param key: The API-Key as a string.
    :type key: str
    ...
    :return: The hashed API-Key as hex code.
    :rtype: hex
    """

    digest = hashlib.sha3_256()
    digest.update(key.encode())

    return digest.hexdigest()
