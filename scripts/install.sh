#! /bin/bash

set -e

cd builder
npm install
cd ..
cd web
bundle
cd ..