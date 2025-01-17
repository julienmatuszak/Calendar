#!/usr/bin/env sh

if [ x"${JAVA_ENABLE_DEBUG}" != x ] && [ "${JAVA_ENABLE_DEBUG}" != "false" ]; then
  echo "Starting with debug enabled"
  java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar /trck.jar
else
  java -jar /trck.jar
fi
