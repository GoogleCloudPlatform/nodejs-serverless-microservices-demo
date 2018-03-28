# Schedule screenshot tasks

This microservice looks for screenshots to grab and stores them as tasks in the "screenshot" queue.

## Required environment variables:

- GOOGLE_CLOUD_PROJECT: Project ID 
- QUEUE_ID: the queue name to creates tasks in.
- QUEUE_LOCATION: region of the queue
- TARGET_SERVICE: name of the service that takes screenshots

## Deployment

- Create a queue with `gcloud alpha tasks queues create-app-engine-queue [QUEUE_ID]`
- Deploy the service with `gcloud app deploy`.
- Create the cron job with `gcloud app deploy cron.yaml`.

## Development

Make sure to have the proper env vars in place, then start local development with `npm start`.

## TODO: 

- read database
- create tasks