#!/bin/bash

# clear all


# cd ../project-profile
# echo "building..."

npm run build

cd ../project-poker-plan
echo "building..."

npm run build

cd ../project-notes
npm run build

cd ../server


# Deploy to App Engine
gcloud app deploy app.yaml -v 1 --project giovanic --quiet --no-promote