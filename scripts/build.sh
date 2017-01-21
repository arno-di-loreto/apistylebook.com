#! /bin/bash

set -e

if [ -z ${JEKYLL_ENV+x} ]
then 
  echo "JEKYLL_ENV is not set"
  exit 1;
else 
  echo "JEKYLL_ENV is set to $JEKYLL_ENV"
fi

function main {
	build
}

function build { 
  cd builder
  CURRENT_PATH=`pwd`
  echo "running builder tests in $CURRENT_PATH"
  npm run coverage
  echo "building json and md in $CURRENT_PATH"
  npm run default
  cd ..
  cp -r builder/dist/web/* web/
  cd web
  CURRENT_PATH=`pwd`
  echo "building site in $CURRENT_PATH"
	bundle exec jekyll build 
}

main

