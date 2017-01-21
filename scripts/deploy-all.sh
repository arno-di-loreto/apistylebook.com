#! /bin/bash

set -e

# web
if [ -z ${DEPLOY_REPO_WEB+x} ]
then 
  DEPLOY_REPO_WEB="https://github.com/arno-di-loreto/apistylebook-web.git"
  echo "DEPLOY_REPO_WEB is not set, using default $DEPLOY_REPO_WEB"
else 
  echo "DEPLOY_REPO_WEB is set to $DEPLOY_REPO_WEB"
fi

if [ -z ${DEPLOY_BRANCH_WEB+x} ]
then 
  DEPLOY_BRANCH_WEB="gh-pages"
  echo "DEPLOY_BRANCH_WEB is not set, using default $DEPLOY_BRANCH_WEB"
else 
  echo "DEPLOY_REPO is set to $DEPLOY_BRANCH_WEB"
fi

if [ -z ${DEPLOY_TARGET_WEB+x} ]
then 
  DEPLOY_TARGET_WEB=".deploy-web"
  echo "DEPLOY_TARGET_WEB is not set, using default $DEPLOY_TARGET_WEB"
else 
  echo "DEPLOY_REPO is set to $DEPLOY_TARGET_WEB"
fi

if [ -z ${BUILD_TARGET_WEB+x} ]
then 
  BUILD_TARGET_WEB="./web/_site"
  echo "BUILD_TARGET_WEB is not set, using default $BUILD_TARGET_WEB"
else 
  echo "BUILD_TARGET_WEB is set to $BUILD_TARGET_WEB"
fi

export DEPLOY_REPO=$DEPLOY_REPO_WEB
export DEPLOY_BRANCH=$DEPLOY_BRANCH_WEB
export DEPLOY_TARGET=$DEPLOY_TARGET_WEB
export BUILD_TARGET=$BUILD_TARGET_WEB

./scripts/deploy.sh

# api

#export DEPLOY_REPO=$DEPLOY_REPO_API
#export DEPLOY_BRANCH_WEB=$DEPLOY_BRANCH_API
#export DEPLOY_TARGET=$DEPLOY_TARGET_API

#deploy.sh
