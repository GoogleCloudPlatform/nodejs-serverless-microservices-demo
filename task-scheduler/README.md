# Schedule screenshot tasks

When executed, this microservice looks for screenshots to grab and stores them as tasks in the "screenshot" queue.

## Required environment variables:

- GOOGLE_CLOUD_PROJECT: Project ID 
- QUEUE_ID: the queue name to creates tasks in.
- QUEUE_LOCATION: region of the queue
- TARGET_SERVICE: name of the service that takes screenshots

## Dependencies

Create a queue with `gcloud alpha tasks queues create-app-engine-queue [QUEUE_ID]`

## Deployment

Deploy the service with `npm run deploy`.

## Scheduling this microservice

Schedule the execution of this microservice with `gcloud app deploy cron.yaml`.

## Development

Make sure to have the proper env vars in place, then start local development with `npm start`.

## TODO: 

- read database for website to screenshot