<div align="center">
    <img src="backend/assets/images/SecureCheckPlusLogoHorizontal.png">
</div>

This page describes how to install and run the application SecureCheckPlus by Accso locally
for further development and testing SecureCheckPlus or just to have a look at it and try it out.

# Running the Application using docker-compose

## Prerequisites

Your development environment has to meet the following criteria:

* You must have a local docker demon running. This is usually done by installing
  [Docker Desktop](https://www.docker.com/products/docker-desktop/) under Windows and macOS or a
  [native Docker daemon](https://docs.docker.com/get-started/get-docker/) under Linux.
* `docker compose` is included with Docker Desktop / Docker Engine 20.10+; no separate install required.
* You must be able to start a Docker container in your local environment.
* You require to obtain a registration key from https://nvd.nist.gov/ if you don't have one already at hand. This is
  necessary to download the vulnerability data from the NVD database. The registration key is free of charge.

## Configuration

Use the preview setup file [docker-compose-preview.yml](docker-compose-preview.yml).
Set `NVD_API_KEY` in the `securecheckplus_server` service if you want live NVD lookups.

For local Docker user mapping, optional variables are:
`RUNNER_UID` and `GID` (defaults are used in preview if unset).
