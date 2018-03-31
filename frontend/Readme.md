# Website history web frontend

Express.js web frontend to display website screenshots

## Dependencies

- Google App Engine
- Cloud Datastore
- Cloud Storage

Make all images in the GCS bucket public, with: `gsutil iam ch allUsers:objectViewer gs://[BUCKET_NAME]`

## Deploy

`npm run deploy`

## TODO

