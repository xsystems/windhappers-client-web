#!/bin/sh

if [ -z "${VERSION}" ]; then
  echo "The VERSION environment variable is NOT set, but is required."
  exit
fi

COMMIT=${COMMIT:-`git rev-parse HEAD`}

NAME=`git remote get-url origin | cut --delimiter='/' --fields=2 | cut --delimiter='.' --fields=1`

git tag --annotate --message "Release ${VERSION}" ${VERSION} ${COMMIT}
git push origin ${VERSION}

./build.sh

docker push xsystems/${NAME}:${VERSION}
docker push xsystems/${NAME}:latest
