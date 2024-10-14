import os

from securecheckplus.settings import BASE_DIR
from analyzer.parser.types import ParseResult

TRUE_DATA = {'bootstrap:3.3.6': ParseResult(dependency_name='bootstrap', version='3.3.6',
                                            path='C:\\Users\\SecureCheckPlus\\Desktop\\vulnerable-node-master\\public\\js\\bootstrap.min.js',
                                            license='NA',
                                            vulnerabilities=['CVE-2016-10735', 'CVE-2018-14040', 'CVE-2018-14041',
                                                             'CVE-2018-14042', 'CVE-2019-8331'],
                                            package_manager='javascript'),
             'jquery:1.11.1': ParseResult(dependency_name='jquery', version='1.11.1',
                                          path='C:\\Users\\SecureCheckPlus\\Desktop\\vulnerable-node-master\\public\\js\\jquery.js',
                                          license='NA',
                                          vulnerabilities=['CVE-2015-9251', 'CVE-2019-11358', 'CVE-2020-11022',
                                                           'CVE-2020-11023'], package_manager='javascript')}


def get_owasp_json():
    file = open(os.path.join(BASE_DIR, "analyzer/test/test_object/owasp/report.json"))
    json_string = file.read()
    file.close()
    return json_string
