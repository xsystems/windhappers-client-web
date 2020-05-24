#!/bin/sh

NAME=`git remote get-url origin | cut --delimiter='/' --fields=2 | cut --delimiter='.' --fields=1`
VERSION=${VERSION:-latest}

npm install
polymer build
cp docker/* build/
docker build -t xsystems/${NAME}:${VERSION} build
