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
* You must have [docker-compose](https://docs.docker.com/compose/install/) installed
* You must be able to start a Docker container in your local environment.
* You require to obtain a registration key from https://nvd.nist.gov/ if you don't have one already at hand. This is
  necessary to download the vulnerability data from the NVD database. The registration key is free of charge.

## Configuration

You need to edit the docker-compose file [docker-compose-dev.yml](docker-compose-dev.yml) to set the
nvd registration key. To do so, set the environment variable `NVD_API_KEY` in the `backend` service to you  
