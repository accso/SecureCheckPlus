<div align="center">
    <img src="backend/assets/images/SecureCheckPlusLogoHorizontal.png">
</div>

# Running the Application as Docker Container

The application SecureCheckPlus is provided as Docker image at https://hub.docker.com/u/accso. The name of the image 
is `accso/secure-check-plus:latest`.

## Prerequisites

Your production environment has to meet the following criteria:

* You must be able to start a Docker container in a run-time environment (such as Kubernetes).
* The PostgreSQL instance must be reachable from the Docker container over the non-SSL port. For security reasons
  the database server should be in the same subnet/VPN as the Docker container.
* If you decide to use an LDAP server for authorization, this server must be reachable from the Docker container. The
  LDAP server must be reachable over the non-SSL port. For security reasons
  the LDAP server should be in the same subnet/VPN as the Docker container.
* Your CI server must be able to reach the API of SecureCheckPlus.
* Your users must be able to reach the Webfrontend of SecureCheckPlus.

## Configuration

The configuration of the application is solely done by providing environment variables to the Docker container. These
are exactly the same as the ones described in the [backend/env.template](backend/env.template), albeit their values may
differ considerably in a production setup.

TODO: Port, LDAP groups

## Advanced Configuration

The production image (in contrast to the development setup) provides the following additional environment variables:

* `BASE_URL`: When set, this value will be used as a URL prefix to both the webfrontend and the Analyzer API.

## Setup Using docker-compose

See TODO. 
