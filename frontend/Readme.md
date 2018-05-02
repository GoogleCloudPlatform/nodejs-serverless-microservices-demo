# Website history web frontend

Express.js web frontend to display website screenshots

## Dependencies

- Google App Engine
- Cloud Datastore
- Cloud Storage

Make all images in the GCS bucket public, with: `gsutil iam ch allUsers:objectViewer gs://[BUCKET_NAME]`

## Development

Run locally with pretty printed bunyan logs with `npm run dev`.

## Deploy

`npm run deploy`

## Notes

To run this locally you will need to set the following ENVARS

* GCLOUD\_PROJECT
  - Name of your project
* GOOGLE\_APPLICATION\_CREDENTIALS
  - Path to local service account crednetials
  - more details at https://cloud.google.com/docs/authentication/getting-started
* BUCKET_NAME
  - name of the bucket

## TODO

