#!/bin/sh

npm install
polymer build
cp docker/* build/
docker build -t xsystems/windhappers-client-web build
