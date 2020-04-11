#!/bin/sh

envsubst < ${APP_HOME}/keycloak.json.template >${APP_HOME}/keycloak.json

exec "$@"
