#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# go to dist
cd dist

# do git stuff
git init
git add -A
git commit -m 'deploy'
git branch -m master main
git push -f git@github.com:unlikenesses/c-t.git main:gh-pages