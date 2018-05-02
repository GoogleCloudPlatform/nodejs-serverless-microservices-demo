# screenshot

A Node.js microservice that takes screenshots of a given URL and stores it in Google Cloud Storage.

## Dependencies

- A Google Cloud Storage bucket

## Usage

Start with `npm start`

Capture a screenshot with `\<url>`.

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
