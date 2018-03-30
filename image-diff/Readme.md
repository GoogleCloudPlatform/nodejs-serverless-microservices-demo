# Image Diff Function

Simple function that compares any new image uploaded to GCS with a reference image

## Dependencies

- a GCS bucket, create one with `gsutil mb gs://[GLOBALLY_UNIQUE_BUCKET_NAME]` (and update the deploy command in `package.json` to reflect this)
- Enable the Cloud Functions API

## Deploy

`npm run deploy`

## TODO
