<div align="center">
    <img src="backend/assets/images/SecureCheckPlusLogoHorizontal.png">
</div>

# Overview

SecureCheckPlus by Accso is a web application that can be integrated into the CI/CD process via an adapter.
It allows the identification, review, and documentation of already known vulnerabilities based on the libraries used.

## Disclaimer

SecureCheckPlus does _not_ scan for vulnerabilities itself. This is done by industry standard tools such as OWASP.

## Licence

SecureCheckPlus by Accso has been published under the [Apache V2 Licence](LICENCE.md).

## Contribute

Although Secure Check Plus by Accso is mainly maintained by the DevOps Community at Accso we welcome suggestions,
feature requests, bug reports, and contributions by the open source community. 
See the [Contribution Readme](CONTRIBUTE.md) for details.

## Prerequisites

For a full fledge installation of SecureCheckPlus by Accso you will need

* a PostgreSQL instance,
* a run-time environment for a Docker container, such as a 
  [native Docker daemon](https://docs.docker.com/get-started/get-docker/) under Linux, 
  a [Docker Desktop installation](https://www.docker.com/products/docker-desktop/) under Windows and macOS or 
  cloud based run-time such as [Kubernetes](https://kubernetes.io/), 
* a software-pipeline building the software application that you would like to monitor.   

## Installation

Make sure you have a running [PostgreSQL instance](https://www.postgresql.org/) available. Create a new database and 
a user with access to the database (including permissions to create database object such as tables and indexes). 
For the subsequent steps we will assume that you have the following data at hand:

* the hostname (or IP address) of the PostgreSQL server,
* the port number (usually 5432) of the database,
* the name of the database,
* the name of the database user, and
* the password of the database user.

See the [Server Installation Readme](README-INSTALLATION.md) for the installation of the SecureCheckPlus Plus server. 
As soon as the server is set up, consult the [Webfrontend Readme](README-FRONTEND.md) to create a configuration for 
the first project that you would like to monitor. This will give you 

* the project id and 
* the API key 

for the final step which is to integrate the SecureCheckPlus adapter into your CI pipeline. See the 
[Adapter Readme](README-ADAPTER.md) on how to modify your pipeline.


## Additional Informationen

### Supported Languages By the OWASP Scanner 

- .NET
- Java
- Node.js / NPM packages
- Ruby
- Python (experimental)
- PHP (experimental)
- Go (experimental)
- Swift (experimental)

### Possible future feature (also see [enhancement issues](https://github.com/accso/SecureCheckPlus/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)):
- Support for [CycloneDX](https://cyclonedx.org/tool-center/) SBOM reports - More languages
- Support for [Trivy](https://github.com/aquasecurity/trivy) reports - Images, Secrets, IaC files
- EMail notifications to developers.

### API Description

See the [API Readme](API.md).

### Architecture

See the [Architecture Readme](ARCHITECTURE.md)