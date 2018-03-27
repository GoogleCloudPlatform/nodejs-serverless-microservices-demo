# Schedule screenshot tasks

This microservice looks for screenshots to grab and stores them as tasks in the "screenshot" queue.

## Required environment variables:

- QUEUE_ID: the queue name to creates tasks in.
- QUEUE_LOCATION: region of the queue

## Deployment

- Deploy the service with `gcloud app deploy`.
- Create the cron job with `gcloud app deploy cron.yaml`.

## Development

Make sure to have the proper env vars in place, then start local development with `npm start`.

## TODO: 

- read database
- create tasks