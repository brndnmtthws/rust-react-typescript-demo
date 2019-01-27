#!/bin/sh

set -e

run_backend() {
  while : ; do
    foodi-backend
    sleep 1s
  done
}

run_backend &

set -x

exec /usr/bin/openresty -g "daemon off;"
