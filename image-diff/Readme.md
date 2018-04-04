# Image Diff Function

Simple function that compares any new image uploaded to GCS with a reference image

## Dependencies

- a GCS bucket, create one with `gsutil mb gs://[GLOBALLY_UNIQUE_BUCKET_NAME]` (and update the deploy command in `package.json` to reflect this)
- Enable the Cloud Functions API

## Deploy

`npm run deploy`

## How it works

This function listen for new files created in the given Cloud Storage bucket.
If a new file is detected in a `screenshots/<url>/` folder, then it will compare this image with a potential reference image `references/<url>/ref.png`.
If a difference is found, then the reference is updated and the image is copied to a `keyframes/<url>/` folder.