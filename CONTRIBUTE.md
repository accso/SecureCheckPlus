<div align="center">
    <img src="backend/assets/images/SecureCheckPlusLogoHorizontal.png">
</div>

# How to Contribute

## Bug Reports and Feature Requests

Please, submit bug reports and feature requests using the [GitHub issue option](issues).

## Contribute Code

This page describes the steps to set up the application for development on your PC.

### Prerequisites

The following software packages are required:

* an NVD-API-Key to fetch CVE information. Get one at [nvd.nist.gov](https://nvd.nist.gov/developers/request-an-api-key),
* an installation of [Docker](https://docs.docker.com/get-started/get-docker/) and 
  [docker-compose](https://docs.docker.com/compose/install/) (this may require additional software such as 
  [Docker Desktop](https://www.docker.com/products/docker-desktop/) on Windows and macOS),
* an installation of Python (version >= 3.11), and
* an installation of node.js.

## Preparation of the Development Environment

### Configuration

* Clone the project from https://github.com/accso/SecureCheckPlus
* Create a file called `.env` as a copy of the annotated [backend/env.template](backend/env.template) 
  in the directory `backend`.
* Adapt the environment variables to your setup.

### Users and Credentials

There are two ways to set up users and their credentials. The most basic setup (only recommended for development)
is to have one regular user and one administration user. The more sophisticated setup is to use an LDAP server
with configured users and two groups (one for regular users, the other for administrators). The development setup
supports both ways. See (see [backend/env.template](backend/env.template)) for details.

### Prepare the Backend

* Create a virtual Python environment and activate it.
* Go to the directory `backend`.
* Run `python3 -m pip install -r requirements.py` in a shell. This will install all required Python packages
  (including Django) into your virtual environment.

### Run the Backend and Helper Services

* Go to the root directory.
* Run `docker-compose build` and `docker-compose up -d` in a shell.

### Prepare and Run the Frontend
* Go to the directory `frontend`.
* Run `npm install` (if you get an error about a missing version, see [Troubleshooting](#troubleshooting)).
* Run `npm run dev`.

### Login into the Application

* Open a browser and load http://localhost:8080/ .
* Use ANY email address as username and the password provided in the file `.env`.

## Troubleshooting

### Error `No version is set for command npm` while running `npm install`

You have not selected a Node.js version to use yet. Create a small ASCII file with filename `~/.tool-versions`
containing the version returned by the failed `npm` call, e.g.

     nodejs [VERSION]
